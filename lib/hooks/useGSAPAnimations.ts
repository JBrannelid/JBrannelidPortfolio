"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { InteractiveTarget } from "@/lib/types/scene.types";
import type { InteractiveObject } from "@/lib/types/scene.types";

// TYPES
interface UseGSAPAnimationsProps {
  interactiveObjects: Map<string, InteractiveObject> | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
}

// CONSTANTS
const BOUNCE_CONFIG = {
  height: 0.08,
  duration: 0.8,
};

const HOVER_CONFIG = {
  scale: 1.05,
  rotation: 0.05, // ~3 degrees in radians
  duration: 0.3,
};
const EXCLUDED_TARGETS: InteractiveTarget[] = [
  InteractiveTarget.TVScreen,
  InteractiveTarget.ComputerScreen,
];

const CAMERA_ZOOM_DISTANCE = 3.5;

// MAIN HOOK
export function useGSAPAnimations({
  interactiveObjects,
  scene,
  camera,
  controls,
}: UseGSAPAnimationsProps) {
  // GSAP Context
  const scope = useRef<gsap.Context | null>(null);
  const contactBounceRef = useRef<gsap.core.Tween | null>(null);
  const originalCameraPosition = useRef<THREE.Vector3 | null>(null);
  const originalControlsTarget = useRef<THREE.Vector3 | null>(null);

  // Helper: Set Controls Enabled
  const setControlsEnabled = useCallback(
    (enabled: boolean) => {
      if (controls) {
        controls.enabled = enabled;
      }
    },
    [controls]
  );

  // INIT: Setup Context and Default Animations
  useEffect(() => {
    if (!interactiveObjects || !scene || !camera || !controls) return;

    // Save original camera positions
    if (!originalCameraPosition.current) {
      originalCameraPosition.current = camera.position.clone();
    }
    if (!originalControlsTarget.current) {
      originalControlsTarget.current = controls.target.clone();
    }

    // Save original mesh positions
    interactiveObjects.forEach((obj) => {
      const mesh = obj.mesh;
      if (!mesh.userData.originalPosition) {
        mesh.userData.originalPosition = mesh.position.clone();
      }
      if (!mesh.userData.originalScale) {
        mesh.userData.originalScale = mesh.scale.clone();
      }
      if (!mesh.userData.originalRotation) {
        mesh.userData.originalRotation = mesh.rotation.y;
      }
    });

    // Create GSAP context
    scope.current = gsap.context(() => {
      // Contact bounce animation (constant)
      const contactObj = interactiveObjects.get(InteractiveTarget.Contact);
      if (contactObj) {
        const mesh = contactObj.mesh;
        const originalY = mesh.userData.originalPosition?.y ?? mesh.position.y;

        contactBounceRef.current = gsap.to(mesh.position, {
          y: originalY + BOUNCE_CONFIG.height,
          duration: BOUNCE_CONFIG.duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, scene);

    return () => {
      scope.current?.revert();
    };
  }, [interactiveObjects, scene, camera, controls]);

  // ACTION: Click Animation (Camera Zoom)
  const createClickAnimation = useCallback(
    async (object: InteractiveObject): Promise<void> => {
      if (
        !camera ||
        !controls ||
        !originalControlsTarget.current ||
        !originalCameraPosition.current
      ) {
        return Promise.resolve();
      }

      if (!object || !object.mesh) {
        return Promise.resolve();
      }

      const mesh = object.mesh;

      // Force update world matrix
      mesh.updateMatrixWorld(true);

      // Get world position
      const targetPosition = new THREE.Vector3();
      mesh.getWorldPosition(targetPosition);

      // Calculate Camera Position
      const offset = new THREE.Vector3(1, 0.5, 1)
        .normalize()
        .multiplyScalar(CAMERA_ZOOM_DISTANCE);
      const cameraPosition = targetPosition.clone().add(offset);

      return new Promise((resolve) => {
        setControlsEnabled(false);

        const tl = gsap.timeline({
          onStart: () => {},
          onComplete: () => {
            if (controls) {
              controls.target.copy(targetPosition);
            }
            resolve();
          },
        });

        tl.to(
          camera.position,
          {
            x: cameraPosition.x,
            y: cameraPosition.y,
            z: cameraPosition.z,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        ).to(
          controls.target,
          {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        );
      });
    },
    [camera, controls, setControlsEnabled]
  );

  // ACTION: Close/Reset Animation
  const createModalCloseAnimation = useCallback(async (): Promise<void> => {
    if (
      !camera ||
      !controls ||
      !originalCameraPosition.current ||
      !originalControlsTarget.current
    ) {
      return Promise.resolve();
    }

    const targetCamPos = originalCameraPosition.current;
    const targetControlsPos = originalControlsTarget.current;

    return new Promise((resolve) => {
      setControlsEnabled(false);

      const tl = gsap.timeline({
        onComplete: () => {
          setControlsEnabled(true);
          resolve();
        },
      });

      tl.to(
        camera.position,
        {
          x: targetCamPos.x,
          y: targetCamPos.y,
          z: targetCamPos.z,
          duration: 1.0,
          ease: "power3.inOut",
        },
        0
      ).to(
        controls.target,
        {
          x: targetControlsPos.x,
          y: targetControlsPos.y,
          z: targetControlsPos.z,
          duration: 1.0,
          ease: "power3.inOut",
        },
        0
      );
    });
  }, [camera, controls, setControlsEnabled]);

  // ACTION: Hover Animation (scale + subtle rotation)
  const createHoverAnimation = useCallback(
    (object: InteractiveObject): void => {
      if (!object || !object.mesh) return;

      // Check if this object should have hover effect
      if (EXCLUDED_TARGETS.includes(object.type)) {
        return; // No hover for screens
      }

      const mesh = object.mesh;

      // Animate scale and rotation
      gsap.to(mesh.scale, {
        x: HOVER_CONFIG.scale,
        y: HOVER_CONFIG.scale,
        z: HOVER_CONFIG.scale,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });

      gsap.to(mesh.rotation, {
        y: mesh.rotation.y + HOVER_CONFIG.rotation,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });
    },
    []
  );

  // ACTION: Hover Out Animation (reset to original)
  const createHoverOutAnimation = useCallback(
    (object: InteractiveObject): void => {
      if (!object || !object.mesh) return;

      // Check if this object should have hover effect
      if (EXCLUDED_TARGETS.includes(object.type)) {
        return; // No hover for screens
      }

      const mesh = object.mesh;
      const originalScale =
        mesh.userData.originalScale || new THREE.Vector3(1, 1, 1);
      const originalRotation = mesh.userData.originalRotation || 0;

      // Reset scale and rotation
      gsap.to(mesh.scale, {
        x: originalScale.x,
        y: originalScale.y,
        z: originalScale.z,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });

      gsap.to(mesh.rotation, {
        y: originalRotation,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });
    },
    []
  );

  return {
    createHoverAnimation,
    createHoverOutAnimation,
    createClickAnimation,
    createModalCloseAnimation,
    setControlsEnabled,
  };
}
