//  No materials in GLB - we apply everything via texture uv maps
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  ModelConfig,
  TextureType,
  InteractiveTarget,
  LoadedModel,
  InteractiveObject,
} from "../../types/scene.types";
import { TextureLoaderUtility } from "./TextureLoader";

/**
 * ModelLoader Class
 * Handles loading of GLB models with DRACO compression and texture application
 */
export class ModelLoader {
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: TextureLoaderUtility;
  private loadingManager?: THREE.LoadingManager;

  constructor(loadingManager?: THREE.LoadingManager) {
    this.loadingManager = loadingManager;

    // Initialize DRACO Loader for compressed glb room models
    this.dracoLoader = new DRACOLoader(loadingManager);
    this.dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    this.dracoLoader.preload();

    this.gltfLoader = new GLTFLoader(loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.textureLoader = new TextureLoaderUtility(loadingManager);
  }

  /**
   * Load model with textures and return scene with interactive objects
   * @param config - Model configuration including path and textures
   * @returns Promise resolving to loaded model with interactive objects
   */
  async loadModel(config: ModelConfig): Promise<LoadedModel> {
    try {
      // Load textures first then GLTF room model
      const textureMap = await this.textureLoader.loadTextures(config.textures);
      const gltf = await this.loadGLTF(config.path);

      // Apply materials and track statistics
      const stats = this.applyMaterialsToScene(gltf.scene, textureMap);

      // Log material application statistics (development mode)
      if (process.env.NODE_ENV === "development") {
        console.log("📦 Model loaded:", config.path);
        console.log("🎨 Materials applied:", {
          textured: stats.texturedCount,
          targets: stats.targetCount,
          screens: stats.screenCount,
          other: stats.otherCount,
          total: stats.totalMeshes,
        });
      }

      // Find and map interactive objects
      const interactiveObjects = this.findInteractiveObjects(gltf.scene);

      return {
        scene: gltf.scene,
        interactiveObjects,
      };
    } catch (error) {
      console.error("❌ Failed to load model:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error loading model");
    }
  }

  /**
   * Load GLTF/GLB file
   * @param path - Path to the model file
   * @returns Promise resolving to GLTF object
   */
  private async loadGLTF(path: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });
  }

  /**
   * Apply materials to all meshes in the scene
   * @param scene - The loaded scene
   * @param textureMap - Map of textures to apply
   * @returns Statistics about applied materials
   */
  private applyMaterialsToScene(
    scene: THREE.Group,
    textureMap: Map<TextureType, THREE.Texture>
  ): {
    texturedCount: number;
    targetCount: number;
    screenCount: number;
    otherCount: number;
    totalMeshes: number;
  } {
    let texturedCount = 0;
    let targetCount = 0;
    let screenCount = 0;
    let otherCount = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const applied = this.applyMaterial(child, textureMap);

        if (applied === "textured") texturedCount++;
        else if (applied === "target") targetCount++;
        else if (applied === "screen") screenCount++;
        else otherCount++;
      }
    });

    return {
      texturedCount,
      targetCount,
      screenCount,
      otherCount,
      totalMeshes: texturedCount + targetCount + screenCount + otherCount,
    };
  }

  /**
   * Apply material to a single mesh based on its name
   * @param child - Mesh to apply material to
   * @param textureMap - Map of available textures
   * @returns Material type applied
   */
  private applyMaterial(
    child: THREE.Mesh,
    textureMap: Map<TextureType, THREE.Texture>
  ): "textured" | "target" | "screen" | "other" {
    const name = child.name;

    // 1. STRUCTURE mesh → TextureStructureDenoise.webp
    if (name.includes("Structure")) {
      const texture = textureMap.get(TextureType.Structure);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
        });
        this.enableShadows(child);
        return "textured";
      }
    }

    // 2. ITEMS mesh → TextureItemsDenoise.webp
    if (name.includes("Items")) {
      const texture = textureMap.get(TextureType.Items);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
        });
        this.enableShadows(child);
        return "textured";
      }
    }

    // 3. ENV mesh → TextureEnv.webp
    if (name.includes("Env")) {
      const texture = textureMap.get(TextureType.Environment);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
        });
        this.enableShadows(child);
        return "textured";
      }
    }

    // 4. COMPUTER SCREEN → MaxiElina.JPEG
    if (name === "ComputerScreen-btn") {
      const texture = textureMap.get(TextureType.ComputerScreen);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: 0xffffff,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.0,
        });
        this.enableShadows(child);
        return "screen";
      }
    }

    // 5. TV SCREEN → IMG_3211.JPG
    if (name === "TVScreen-btn") {
      const texture = textureMap.get(TextureType.TVScreen);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: 0xffffff,
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.0,
        });
        this.enableShadows(child);
        return "screen";
      }
    }

    // 6. Other TARGETS/BUTTONS → TargetsTextureDenoise.webp
    if (name.includes("-btn")) {
      const texture = textureMap.get(TextureType.Targets);
      if (texture) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.4,
          metalness: 0.2,
        });

        this.enableShadows(child);
        return "target";
      }
    }

    // 7. All other meshes (fallback)
    this.enableShadows(child);
    return "other";
  }

  /**
   * Enable shadow casting and receiving for a mesh
   * @param mesh - Mesh to enable shadows for
   */
  private enableShadows(mesh: THREE.Mesh): void {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }

  /**
   * Find interactive objects by matching mesh names to InteractiveTarget enum
   * @param scene - Scene to search for interactive objects
   * @returns Map of interactive objects indexed by name
   */
  private findInteractiveObjects(
    scene: THREE.Group
  ): Map<string, InteractiveObject> {
    const interactiveObjects = new Map<string, InteractiveObject>();
    const targetNames = Object.values(InteractiveTarget);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const matchedTarget = targetNames.find(
          (target) => child.name === target
        );

        if (matchedTarget) {
          interactiveObjects.set(child.name, {
            mesh: child,
            name: child.name,
            type: matchedTarget as InteractiveTarget,
            isHovered: false,
          });
          child.userData.interactive = true;
        }
      }
    });

    // Log interactive objects found (development mode)
    if (process.env.NODE_ENV === "development") {
      if (interactiveObjects.size > 0) {
        console.log(`🎯 Found ${interactiveObjects.size} interactive objects:`);
        Array.from(interactiveObjects.keys()).forEach((key) => {
          console.log(`     - "${key}"`);
        });
      } else {
        console.warn("⚠️ No interactive objects found. Expected:");
        targetNames.forEach((name) => console.warn(`     - "${name}"`));
      }
    }

    return interactiveObjects;
  }

  /**
   * Clean up resources
   * Disposes of loaders and clears caches
   */
  dispose(): void {
    this.textureLoader.dispose();
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
  }
}
