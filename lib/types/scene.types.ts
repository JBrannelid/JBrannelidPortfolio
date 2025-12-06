import * as THREE from "three";

/* Texture configuration for different parts of the model */
export interface TextureConfig {
  name: string;
  path: string;
  scene: string;
  uvMap: string;
}

/* Available textures in the scene */
export enum TextureType {
  Environment = "Env",
  Structure = "TextureItems",
  Items = "Items",
  Targets = "Targets", // For interactive buttons
  ComputerScreen = "ComputerScreen",
  TVScreen = "TVScreen",
}

/* Interactive button targets in the model */
export enum InteractiveTarget {
  About = "About-btn",
  Contact = "Contact-btn",
  CV = "CV-btn",
  GitHub = "GitHub-btn",
  LinkedIn = "LinkedIn-btn",
  ComputerScreen = "ComputerScreen-btn",
  TVScreen = "TVScreen-btn",
}

/* Modal types corresponding to interactive targets */
export enum ModalType {
  About = "about",
  Contact = "contact",
  CV = "cv",
}

/* Configuration for the model loader */
export interface ModelConfig {
  path: string;
  textures: Record<TextureType, TextureConfig>;
}

/* Interactive object with its mesh and metadata */
export interface InteractiveObject {
  mesh: THREE.Mesh;
  name: string;
  type: InteractiveTarget;
  isHovered: boolean;
}

/* Scene setup configuration */
export interface SceneConfig {
  backgroundColor: string;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  orbitControls: {
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    dampingFactor: number;
    enablePan?: boolean;
  };
  cameraPositions: {
    mobile: {
      position: THREE.Vector3;
      target: THREE.Vector3;
    };
    desktop: {
      position: THREE.Vector3;
      target: THREE.Vector3;
    };
  };
}

/* Model loader result */
export interface LoadedModel {
  scene: THREE.Group;
  interactiveObjects: Map<string, InteractiveObject>;
}
