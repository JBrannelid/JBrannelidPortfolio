/* Centralized configuration for easy customization */
import { TextureType } from "@/lib/types/scene.types";
import * as THREE from "three";

// Model and Texture Paths
export const ASSET_PATHS = {
  model: "/models/Room_Portfolio_compressed.glb",
  textures: {
    [TextureType.Environment]: "/textures/TextureEnv.webp",
    [TextureType.Structure]: "/textures/TextureStructureDenoise.webp",
    [TextureType.Items]: "/textures/TextureItemsDenoise.webp",
  },
} as const;

// Scene Configuration
export const SCENE_CONFIG = {
  backgroundColor: "#D9CAD1",
  enableShadows: true,
  shadowMapType: THREE.PCFSoftShadowMap,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
} as const;

// Camera Configuration
export const CAMERA_CONFIG = {
  fov: 35,
  near: 0.1,
  far: 200,
  positions: {
    mobile: {
      position: new THREE.Vector3(
        29.567116827654726,
        14.018476147584705,
        31.37040363900147
      ),
      target: new THREE.Vector3(
        -0.08206262548844094,
        3.3119233527087255,
        -0.7433922282864018
      ),
    },
    desktop: {
      position: new THREE.Vector3(
        17.49173098423395,
        9.108969527553887,
        17.850992894238058
      ),
      target: new THREE.Vector3(
        0.4624746759408973,
        1.9719940043010387,
        -0.8300979125494505
      ),
    },
  },
} as const;

// OrbitControls Configuration
export const CONTROLS_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 5,
  maxDistance: 45,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI / 2,
  minAzimuthAngle: 0,
  maxAzimuthAngle: Math.PI / 2,
  enablePan: false,
  enableZoom: true,
} as const;

// Lighting Configuration
export const LIGHTING_CONFIG = {
  ambient: {
    color: 0xffffff,
    intensity: 0.6,
  },
  directional: {
    color: 0xffffff,
    intensity: 0.8,
    position: new THREE.Vector3(5, 10, 7.5),
    castShadow: true,
    shadow: {
      mapSize: { width: 2048, height: 2048 },
      camera: {
        near: 0.1,
        far: 50,
        left: -10,
        right: 10,
        top: 10,
        bottom: -10,
      },
    },
  },
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  hover: {
    duration: 0.3,
    ease: "back.out(2)",
    scale: 1.1,
    yOffset: 0.2,
  },
  click: {
    duration: 0.2,
    ease: "power2.out",
    scale: 0.95,
  },
  modal: {
    duration: 0.5,
    ease: "back.out(2)",
  },
  camera: {
    duration: 1.5,
    ease: "power2.inOut",
  },
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  maxPixelRatio: 2,
  antialias: true,
  powerPreference: "high-performance" as WebGLPowerPreference,
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// External Links Configuration
export const EXTERNAL_LINKS = {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  cv: "/path/to/your/cv.pdf",
  email: "your.email@example.com",
} as const;

/* Interactive Object Actions
 * Map interactive targets to their actions */
export const OBJECT_ACTIONS = {
  "About-btn": "openAboutModal",
  "Contact-btn": "openContactModal",
  "CV-btn": "downloadCV",
  "GitHub-Btn": "openGitHub",
  "LinkedIn-btn": "openLinkedIn",
  "ComputerScreen-btn": "showComputerContent",
  "TVScreen-btn": "showTVContent",
} as const;

// Texture Loading Configuration
export const TEXTURE_CONFIG = {
  colorSpace: THREE.SRGBColorSpace,
  flipY: false,
  minFilter: THREE.LinearMipmapLinearFilter,
  magFilter: THREE.LinearFilter,
  generateMipmaps: true,
  anisotropy: 16,
} as const;

// Loading Screen Configuration
export const LOADING_CONFIG = {
  backgroundColor: "#ead7ef",
  textColor: "#401d49",
  buttonStyle: {
    border: "8px solid #2a0f4e",
    background: "#401d49",
    color: "#e6dede",
  },
  messages: {
    loading: "Loading...",
    ready: "Enter!",
    greeting: "~ 안녕하세요 ~",
  },
} as const;

// Development/Debug Configuration
export const DEBUG_CONFIG = {
  showStats: process.env.NODE_ENV === "development",
  logInteractions: process.env.NODE_ENV === "development",
  showHelpers: false, // Show camera/light helpers
  enableOrbitControls: true,
} as const;

// Utility function to check if device is mobile
export function isMobileDevice(): boolean {
  return window.innerWidth < BREAKPOINTS.mobile;
}

// Utility function to get camera position based on device type
export function getCameraPosition() {
  return isMobileDevice()
    ? CAMERA_CONFIG.positions.mobile
    : CAMERA_CONFIG.positions.desktop;
}
