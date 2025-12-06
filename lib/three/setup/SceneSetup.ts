// SceneSetup
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SceneConfig } from "../../types/scene.types";

// Default scene configuration
export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  backgroundColor: "#D9CAD1",
  cameraFov: 35,
  cameraNear: 0.1,
  cameraFar: 200,

  orbitControls: {
    minDistance: 18, // Locked zoom for desktop
    maxDistance: 18,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: 0,
    maxAzimuthAngle: Math.PI / 2,
    dampingFactor: 0.05,
    enablePan: false,
  },

  cameraPositions: {
    // MOBILE: Far back and centered to see entire room
    mobile: {
      position: new THREE.Vector3(
        20.0, // Centered X (middle between corners)
        16.0, // High up to see from above
        35.0 // FAR BACK to see entire room width
      ),
      target: new THREE.Vector3(
        0.0, // Look at center of room
        3.0, // Look at middle height
        0.0 // Center depth
      ),
    },

    // DESKTOP: Close intimate view
    desktop: {
      position: new THREE.Vector3(
        12.0, // Rotated left position
        5.0, // Camera height
        12.0 // Rotated left depth
      ),
      target: new THREE.Vector3(
        0.4, // Look target X
        1.9, // Look target Y
        -0.8 // Look target Z
      ),
    },
  },
};

export class SceneSetup {
  private config: SceneConfig;

  constructor(config: SceneConfig = DEFAULT_SCENE_CONFIG) {
    this.config = config;
  }

  // Create and configure the main scene
  createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(this.config.backgroundColor);
    return scene;
  }

  // Create and configure the camera
  createCamera(aspect: number): THREE.PerspectiveCamera {
    const isMobile = this.isMobileDevice();

    // Wider FOV on mobile to see more of the room
    const fov = isMobile ? 50 : this.config.cameraFov; // 50° mobile, 35° desktop

    const camera = new THREE.PerspectiveCamera(
      fov,
      aspect,
      this.config.cameraNear,
      this.config.cameraFar
    );

    // Set initial position based on screen size
    const position = isMobile
      ? this.config.cameraPositions.mobile
      : this.config.cameraPositions.desktop;

    camera.position.copy(position.position);

    return camera;
  }

  // Create and configure orbit controls
  createControls(camera: THREE.Camera, domElement: HTMLElement): OrbitControls {
    const controls = new OrbitControls(camera, domElement);
    const isMobile = this.isMobileDevice();

    // Different zoom settings for mobile vs desktop
    if (isMobile) {
      // MOBILE: Can zoom IN, but NOT OUT from start position
      controls.minDistance = 10; // Can zoom IN to 20 units
      controls.maxDistance = 35; // LOCKED at 35 (start position) - can't zoom OUT
      controls.enabled = true;
    } else {
      // DESKTOP: Can zoom IN, but NOT OUT from start position
      controls.minDistance = 5;
      controls.maxDistance = 18;
    }

    // Apply rotation constraints (SAME for mobile and desktop)
    controls.minPolarAngle = this.config.orbitControls.minPolarAngle;
    controls.maxPolarAngle = this.config.orbitControls.maxPolarAngle;
    controls.minAzimuthAngle = this.config.orbitControls.minAzimuthAngle;
    controls.maxAzimuthAngle = this.config.orbitControls.maxAzimuthAngle;

    // Smooth controls
    controls.enableDamping = true;
    controls.dampingFactor = this.config.orbitControls.dampingFactor;

    // Disable panning (no Shift+drag)
    controls.enablePan = this.config.orbitControls.enablePan ?? true;

    // Set initial target based on screen size
    const position = isMobile
      ? this.config.cameraPositions.mobile
      : this.config.cameraPositions.desktop;

    controls.target.copy(position.target);
    controls.update();

    return controls;
  }

  // Create and configure renderer
  createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable shadows if needed
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tone mapping for better colors
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    return renderer;
  }

  // Setup basic lighting for the scene
  setupLighting(scene: THREE.Scene): void {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light for shadows and definition
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;

    scene.add(directionalLight);
  }

  // Handle window resize
  onResize(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = this.isMobileDevice();

    // Update camera aspect ratio
    camera.aspect = width / height;

    // Update FOV based on device (wider on mobile)
    camera.fov = isMobile ? 50 : this.config.cameraFov;

    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  //  Check if device is mobile
  private isMobileDevice(): boolean {
    return window.innerWidth < 768;
  }

  // Get camera position for current device
  getCameraPosition(): { position: THREE.Vector3; target: THREE.Vector3 } {
    const isMobile = this.isMobileDevice();
    return isMobile
      ? this.config.cameraPositions.mobile
      : this.config.cameraPositions.desktop;
  }
}
