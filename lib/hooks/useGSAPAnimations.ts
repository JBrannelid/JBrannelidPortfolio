"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

import {
  BOUNCE_CONFIG,
  CAMERA_ANIMATION_CONFIG,
  CAMERA_ZOOM_DISTANCE,
  HOVER_CONFIG,
  HOVER_EXCLUDED_TARGETS,
} from "@/lib/constants";
import { getMeshWorldNormal } from "@/lib/three/utils/getMeshWorldNormal";
import {
  CameraAnimationResult,
  InteractiveObject,
  UseGSAPAnimationsProps,
} from "@/lib/types";
import { InteractiveTarget } from "@/lib/types";

import { useReducedMotion } from "./useReducedMotion";

export function useGSAPAnimations({
  interactiveObjects,
  scene,
  camera,
  controls,
}: UseGSAPAnimationsProps): CameraAnimationResult {
  const reducedMotion = useReducedMotion();

  // GSAP Context
  const scope = useRef<gsap.Context | null>(null);
  const contactBounceRef = useRef<gsap.core.Tween | null>(null);
  const originalCameraPosition = useRef<THREE.Vector3 | null>(null);
  const originalControlsTarget = useRef<THREE.Vector3 | null>(null);
  const cameraTimelineRef = useRef<gsap.core.Timeline | null>(null);

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

    // Create GSAP context (no scope needed for Three.js objects)
    scope.current = gsap.context(() => {
      // Contact bounce animation (constant) - skipped under reduced motion
      const contactObj = interactiveObjects.get(InteractiveTarget.Contact);
      if (contactObj && !reducedMotion) {
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
    });

    return () => {
      scope.current?.revert();
    };
  }, [interactiveObjects, scene, camera, controls, reducedMotion]);

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

      // Calculate approach direction - screens approach along their own
      // face normal (derived from geometry, so it's correct regardless of
      // how each mesh was rotated during the Blender export). Every other
      // object keeps the fixed diagonal approach.
      const isScreen = HOVER_EXCLUDED_TARGETS.includes(object.type);
      const direction = isScreen
        ? getMeshWorldNormal(mesh)
        : new THREE.Vector3(1, 0.5, 1).normalize();

      if (isScreen && process.env.NODE_ENV === "development") {
        console.log(`🖥️ ${object.type} world normal:`, direction.toArray());
      }

      const cameraPosition = targetPosition
        .clone()
        .add(direction.multiplyScalar(CAMERA_ZOOM_DISTANCE));

      return new Promise((resolve) => {
        cameraTimelineRef.current?.kill();
        setControlsEnabled(false);

        // Drive position, look-target, and camera rotation off a single
        // eased proxy instead of tweening camera.position/controls.target
        // independently - OrbitControls.update() is the only thing that
        // normally reorients the camera to face controls.target, and it's
        // deliberately skipped while controls are disabled (see Scene.tsx),
        // so without this the camera would translate but never turn to
        // actually look at the object.
        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        const proxy = { t: 0 };

        const duration = reducedMotion
          ? 0.01
          : CAMERA_ANIMATION_CONFIG.zoom.duration;

        const tl = gsap.timeline({
          onComplete: () => {
            camera.position.copy(cameraPosition);
            controls.target.copy(targetPosition);
            camera.lookAt(targetPosition);
            cameraTimelineRef.current = null;
            resolve();
          },
        });
        cameraTimelineRef.current = tl;

        tl.to(proxy, {
          t: 1,
          duration,
          ease: CAMERA_ANIMATION_CONFIG.zoom.ease,
          onUpdate: () => {
            camera.position.lerpVectors(startPosition, cameraPosition, proxy.t);
            controls.target.lerpVectors(startTarget, targetPosition, proxy.t);
            camera.lookAt(controls.target);
          },
        });
      });
    },
    [camera, controls, setControlsEnabled, reducedMotion]
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
      cameraTimelineRef.current?.kill();
      setControlsEnabled(false);

      const startPosition = camera.position.clone();
      const startTarget = controls.target.clone();
      const proxy = { t: 0 };

      const duration = reducedMotion
        ? 0.01
        : CAMERA_ANIMATION_CONFIG.reset.duration;

      const tl = gsap.timeline({
        onComplete: () => {
          camera.position.copy(targetCamPos);
          controls.target.copy(targetControlsPos);
          camera.lookAt(targetControlsPos);
          setControlsEnabled(true);
          cameraTimelineRef.current = null;
          resolve();
        },
      });
      cameraTimelineRef.current = tl;

      tl.to(proxy, {
        t: 1,
        duration,
        ease: CAMERA_ANIMATION_CONFIG.reset.ease,
        onUpdate: () => {
          camera.position.lerpVectors(startPosition, targetCamPos, proxy.t);
          controls.target.lerpVectors(startTarget, targetControlsPos, proxy.t);
          camera.lookAt(controls.target);
        },
      });
    });
  }, [camera, controls, setControlsEnabled, reducedMotion]);

  // ACTION: Hover Animation (scale + subtle rotation)
  const createHoverAnimation = useCallback(
    (object: InteractiveObject): void => {
      if (!object || !object.mesh) return;

      // Check if this object should have hover effect
      if (HOVER_EXCLUDED_TARGETS.includes(object.type)) {
        return;
      }

      const mesh = object.mesh;
      const tween = reducedMotion ? gsap.set : gsap.to;

      tween(mesh.scale, {
        x: HOVER_CONFIG.scale,
        y: HOVER_CONFIG.scale,
        z: HOVER_CONFIG.scale,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });

      tween(mesh.rotation, {
        y: mesh.rotation.y + HOVER_CONFIG.rotation,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });
    },
    [reducedMotion]
  );

  // ACTION: Hover Out Animation (reset to original)
  const createHoverOutAnimation = useCallback(
    (object: InteractiveObject): void => {
      if (!object || !object.mesh) return;

      // Check if this object should have hover effect
      if (HOVER_EXCLUDED_TARGETS.includes(object.type)) {
        return; // NO hover for screens
      }

      const mesh = object.mesh;
      const originalScale =
        mesh.userData.originalScale || new THREE.Vector3(1, 1, 1);
      const originalRotation = mesh.userData.originalRotation || 0;
      const tween = reducedMotion ? gsap.set : gsap.to;

      tween(mesh.scale, {
        x: originalScale.x,
        y: originalScale.y,
        z: originalScale.z,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });

      tween(mesh.rotation, {
        y: originalRotation,
        duration: HOVER_CONFIG.duration,
        ease: "power2.out",
      });
    },
    [reducedMotion]
  );

  return {
    createHoverAnimation,
    createHoverOutAnimation,
    createClickAnimation,
    createModalCloseAnimation,
    setControlsEnabled,
  };
}
