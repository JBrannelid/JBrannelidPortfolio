/* Handles Three.js scene initialization, rendering loop, and cleanup */

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SceneSetup } from "@/lib/three/setup/SceneSetup";
import { SceneProps } from "@/lib/types";

interface ThreeRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  sceneSetup: SceneSetup;
  animationFrameId: number | null;
}

export default function Scene({ canvasRef, onSceneReady }: SceneProps) {
  const threeRefs = useRef<ThreeRefs | null>(null);

  // Three js setup - Initialize scene, camera, renderer, controls
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create all Three.js instances
    const sceneSetup = new SceneSetup();
    const scene = sceneSetup.createScene();
    const camera = sceneSetup.createCamera(
      window.innerWidth / window.innerHeight
    );
    const renderer = sceneSetup.createRenderer(canvasRef.current);
    const controls = sceneSetup.createControls(camera, renderer.domElement);

    // Add lighting to scene
    sceneSetup.setupLighting(scene);

    // Store references for access throughout component lifecycle
    threeRefs.current = {
      scene,
      camera,
      renderer,
      controls,
      sceneSetup,
      animationFrameId: null,
    };

    // Notify parent that scene is ready
    onSceneReady({ scene, camera, renderer, controls });

    // Handle window resize
    const handleResize = () => {
      const refs = threeRefs.current;
      if (!refs) return;
      refs.sceneSetup.onResize(refs.camera, refs.renderer);
    };

    window.addEventListener("resize", handleResize);

    // Start render loop
    const animate = () => {
      if (threeRefs.current) {
        threeRefs.current.animationFrameId = requestAnimationFrame(animate);
      }

      const refs = threeRefs.current;
      if (!refs) return;

      // Update controls for damping effect
      refs.controls.update();

      // Render frame
      refs.renderer.render(refs.scene, refs.camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);

      const refs = threeRefs.current;
      if (refs) {
        if (refs.animationFrameId !== null) {
          cancelAnimationFrame(refs.animationFrameId);
        }
        refs.controls.dispose();
        refs.renderer.dispose();
      }
      threeRefs.current = null;
    };
  }, [canvasRef, onSceneReady]);

  return null; // This component doesn't render anything itself
}
