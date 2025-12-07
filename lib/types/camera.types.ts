/**
 * Camera Type Definitions
 * Camera controller and scene reference types
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InteractiveObject, InteractiveTarget } from "./scene.types";

export interface UseCameraControllerProps {
  model: { interactiveObjects: Map<string, InteractiveObject> } | null;
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  controls: OrbitControls | null;
}

export interface UseCameraControllerResult {
  isViewingScreen: boolean;
  zoomToObject: (target: InteractiveTarget) => Promise<void>;
  resetCamera: () => Promise<void>;
  setControlsEnabled: (enabled: boolean) => void;
}

export interface ThreeSceneRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

export interface SceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onSceneReady: (refs: ThreeSceneRefs) => void;
}
