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

  async loadModel(config: ModelConfig): Promise<LoadedModel> {
    try {
      // Load textures first then GLTF room model
      const textureMap = await this.textureLoader.loadTextures(config.textures);
      const gltf = await this.loadGLTF(config.path);

      // Apply materials
      let texturedCount = 0;
      let targetCount = 0;
      let screenCount = 0;
      let otherCount = 0;

      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const applied = this.applyMaterial(child, textureMap);

          if (applied === "textured") texturedCount++;
          else if (applied === "target") targetCount++;
          else if (applied === "screen") screenCount++;
          else otherCount++;
        }
      });

      const interactiveObjects = this.findInteractiveObjects(gltf.scene);

      return {
        scene: gltf.scene,
        interactiveObjects,
      };
    } catch (error) {
      throw error;
    }
  }

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

    // 7. All other meshes
    this.enableShadows(child);
    return "other";
  }

  private enableShadows(mesh: THREE.Mesh): void {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }

  // Find interactive objects by matching mesh names to InteractiveTarget enum
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

    if (interactiveObjects.size > 0) {
      Array.from(interactiveObjects.keys()).forEach((key) => {
        console.log(`     - "${key}"`);
      });
    } else {
      targetNames.forEach((name) => console.warn(`     - "${name}"`));
    }

    return interactiveObjects;
  }

  dispose(): void {
    this.textureLoader.dispose();
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
  }
}
