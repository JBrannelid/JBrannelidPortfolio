/**
 * Interaction Type Definitions
 * Raycasting and object interaction types
 */

import * as THREE from "three";
import {
  InteractiveObject,
  InteractiveTarget,
  LoadedModel,
} from "./scene.types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface UseInteractiveObjectsProps {
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  interactiveObjects: Map<string, InteractiveObject> | null;
  onObjectClick?: (target: InteractiveTarget) => void;
  onObjectHover?: (target: InteractiveTarget | null) => void;
}

export interface UseInteractiveObjectsResult {
  getCurrentHovered: () => InteractiveObject | null;
  raycaster: THREE.Raycaster;
}

export interface InteractionManagerProps {
  model: LoadedModel | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  controls: OrbitControls | null;
  onObjectClick: (target: InteractiveTarget) => void;
}
