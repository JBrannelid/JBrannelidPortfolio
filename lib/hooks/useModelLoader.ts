// React hook for loading and managing the 3D model lifecycle
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { ModelLoader } from "../three/loaders/ModelLoader";
import { ModelConfig, LoadedModel, TextureType } from "../types/scene.types";

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
 * @returns Object containing model, loading state, error, and progress
 */
export function useModelLoader(
  scene: THREE.Scene | null
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

    // Create loading manager to track progress
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      const progressPercent = (itemsLoaded / itemsTotal) * 100;
      if (isMounted) {
        setProgress(progressPercent);
      }
    };

    loadingManager.onLoad = () => {
      console.log("✅ All assets loaded successfully");
    };

    loadingManager.onError = (url) => {
      console.error(`❌ Error loading asset: ${url}`);
    };

    // Load the model
    async function loadModel() {
      try {
        setIsLoading(true);
        setError(null);

        modelLoader = new ModelLoader(loadingManager);
        const loadedModel = await modelLoader.loadModel(MODEL_CONFIG);

        if (isMounted && scene) {
          // Add the model to the scene
          scene.add(loadedModel.scene);

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
  }, [scene]); // Only re-run if scene changes

  return { model, isLoading, error, progress };
}
