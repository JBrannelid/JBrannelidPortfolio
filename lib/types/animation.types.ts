/**
 * Animation Type Definitions
 * GSAP and animation-related types
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InteractiveObject } from "./scene.types";

export interface UseGSAPAnimationsProps {
  interactiveObjects: Map<string, InteractiveObject> | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
}

export interface AnimationConfig {
  height?: number;
  duration: number;
  ease?: string;
  scale?: number;
  rotation?: number;
}

export interface CameraAnimationResult {
  createClickAnimation: (object: InteractiveObject) => Promise<void>;
  createModalCloseAnimation: () => Promise<void>;
  createHoverAnimation: (object: InteractiveObject) => void;
  createHoverOutAnimation: (object: InteractiveObject) => void;
  setControlsEnabled: (enabled: boolean) => void;
}
