// React hook for loading and managing the 3D model lifecycle
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { ModelLoader } from "../three/loaders/ModelLoader";
import { LoadedModel, ModelConfig, TextureType } from "../types/scene.types";

interface UseModelLoaderResult {
  model: LoadedModel | null;
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

// Configuration for the portfolio room model
const MODEL_CONFIG: ModelConfig = {
  path: "/models/Room_Portfolio_compressed.glb",
  textures: {
    [TextureType.Environment]: {
      name: "Env",
      path: "/textures/TextureEnv.webp",
      scene: "EnvTexture",
      uvMap: "UVBaking",
    },
    [TextureType.Structure]: {
      name: "TextureItems",
      path: "/textures/TextureStructureDenoise.webp",
      scene: "StructureTextureSet",
      uvMap: "UVBaking",
    },
    [TextureType.Items]: {
      name: "Items",
      path: "/textures/TextureItemsDenoise.webp",
      scene: "ItemsTextureSet",
      uvMap: "UVBaking",
    },
    [TextureType.Targets]: {
      name: "Targets",
      path: "/textures/TargetsTextureDenoise.webp",
      scene: "TargetsTextureSet",
      uvMap: "UVBaking",
    },
    // Image textures for screens
    [TextureType.ComputerScreen]: {
      name: "ComputerScreen",
      path: "/images/MaxiElina.JPEG",
      scene: "ComputerScreenTexture",
      uvMap: "BakingUV",
    },
    [TextureType.TVScreen]: {
      name: "TVScreen",
      path: "/images/IMG_3211.JPG",
      scene: "TVScreenTexture",
      uvMap: "BakingUV",
    },
  },
};

/**
 * Custom hook for loading and managing 3D model lifecycle
 * Handles model loading, progress tracking, and proper cleanup
 *
 * @param scene - Three.js scene to add the model to
 * @param renderer - Used both by ModelLoader (uploads every texture to the
 * GPU as soon as it's decoded, via `initTexture`) and here (precompiles
 * shaders via `compileAsync` once the model is in the scene) - together
 * they front-load the two costs that otherwise land inside the render
 * loop's first draw of this model.
 * @param camera - Passed straight through to `renderer.compileAsync`.
 * @returns Object containing model, loading state, error, and progress
 */
export function useModelLoader(
  scene: THREE.Scene | null,
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.Camera | null
): UseModelLoaderResult {
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  // Use ref to store current model for cleanup without dependency issues
  const modelRef = useRef<LoadedModel | null>(null);

  useEffect(() => {
    if (!scene) return;

    let isMounted = true;
    let modelLoader: ModelLoader | null = null;
    // LoadingManager's itemsTotal can still grow mid-load; this floor keeps
    // the displayed percentage from ever visibly dropping.
    let maxProgress = 0;

    // Create loading manager to track progress
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      const progressPercent = (itemsLoaded / itemsTotal) * 100;
      maxProgress = Math.max(maxProgress, progressPercent);
      if (isMounted) {
        setProgress(maxProgress);
      }
    };

    // Load the model
    async function loadModel() {
      try {
        setIsLoading(true);
        setError(null);

        modelLoader = new ModelLoader(loadingManager, renderer ?? undefined);
        const loadedModel = await modelLoader.loadModel(MODEL_CONFIG);

        if (isMounted && scene) {
          // Add the model to the scene
          scene.add(loadedModel.scene);

          // Kick off shader/material precompilation in the same
          // synchronous turn as scene.add(), so it's already in flight
          // before the next animation frame renders this model for the
          // first time. Fire-and-forget: the loading UI doesn't wait on it.
          if (renderer && camera) {
            renderer.compileAsync(scene, camera);
          }

          // Update both state and ref
          setModel(loadedModel);
          modelRef.current = loadedModel;
          setIsLoading(false);
          setProgress(100);
        }
      } catch (err) {
        if (isMounted) {
          const modelError =
            err instanceof Error ? err : new Error("Failed to load model");
          console.error("Model loading error:", modelError);
          setError(modelError);
          setIsLoading(false);
        }
      }
    }

    loadModel();

    // Cleanup function
    return () => {
      isMounted = false;

      // Use ref to access current model (avoids stale closure)
      const currentModel = modelRef.current;

      // Remove model from scene
      if (currentModel?.scene && scene) {
        scene.remove(currentModel.scene);
      }

      // Dispose of model loader resources
      if (modelLoader) {
        modelLoader.dispose();
      }

      // Dispose of model meshes and materials to prevent memory leaks
      if (currentModel?.scene) {
        currentModel.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Dispose geometry
            child.geometry?.dispose();

            // Dispose materials
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
      }

      // Clear ref
      modelRef.current = null;
    };
  }, [scene, renderer, camera]);

  return { model, isLoading, error, progress };
}
