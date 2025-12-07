// TextureLoader utility for loading and configuring textures in Three.js
import * as THREE from "three";
import { TextureConfig, TextureType } from "../../types/scene.types";

export class TextureLoaderUtility {
  private loader: THREE.TextureLoader;
  private cache: Map<string, THREE.Texture>;
  private loadingManager?: THREE.LoadingManager;

  constructor(loadingManager?: THREE.LoadingManager) {
    this.loadingManager = loadingManager;
    this.loader = new THREE.TextureLoader(loadingManager);
    this.cache = new Map();
  }

  // Load textures - returns IMMEDIATELY with loaded textures
  async loadTextures(
    configs: Record<TextureType, TextureConfig>
  ): Promise<Map<TextureType, THREE.Texture>> {
    const textureMap = new Map<TextureType, THREE.Texture>();

    // Load all textures
    const loadPromises = Object.entries(configs).map(([type, config]) => {
      return this.loadTexture(config.path).then((texture) => {
        textureMap.set(type as TextureType, texture);
        return { type, success: true };
      });
    });

    await Promise.all(loadPromises);

    return textureMap;
  }

  //  Load single texture with Three.js configuration
  private loadTexture(path: string): Promise<THREE.Texture> {
    // Check cache
    if (this.cache.has(path)) {
      return Promise.resolve(this.cache.get(path)!);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (texture) => {
          // Configure texture
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = false; // Important for GLB models!
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;

          this.cache.set(path, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }

  dispose(): void {
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
  }
}
