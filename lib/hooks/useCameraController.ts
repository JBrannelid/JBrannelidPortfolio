/* Manages camera zoom animations and screen view escape functionality */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  InteractiveTarget,
  UseCameraControllerProps,
  UseCameraControllerResult,
} from "@/lib/types";
import { useGSAPAnimations } from "./useGSAPAnimations";

export function useCameraController({
  model,
  camera,
  scene,
  controls,
}: UseCameraControllerProps): UseCameraControllerResult {
  const [isViewingScreen, setIsViewingScreen] = useState(false);
  const currentViewedTarget = useRef<InteractiveTarget | null>(null);

  // GSAP animations for camera movement
  const {
    createClickAnimation,
    createModalCloseAnimation,
    setControlsEnabled,
  } = useGSAPAnimations({
    interactiveObjects: model?.interactiveObjects || null,
    scene,
    camera,
    controls,
  });

  // Zoom camera to target object
  const zoomToObject = useCallback(
    async (target: InteractiveTarget): Promise<void> => {
      if (!model?.interactiveObjects) return;

      const targetObject = Array.from(model.interactiveObjects.values()).find(
        (obj) => obj.type === target
      );

      if (!targetObject) {
        console.error("Interactive object not found:", target);
        return;
      }

      // Check if this is a screen object
      const isScreen =
        target === InteractiveTarget.TVScreen ||
        target === InteractiveTarget.ComputerScreen;

      // Enable escape mode for screens
      if (isScreen) {
        setIsViewingScreen(true);
        currentViewedTarget.current = target;
      }

      // Animate camera zoom to target
      await createClickAnimation(targetObject);
    },
    [model, createClickAnimation]
  );

  // Return camera to original position
  const resetCamera = useCallback(async (): Promise<void> => {
    setIsViewingScreen(false);
    currentViewedTarget.current = null;
    await createModalCloseAnimation();
  }, [createModalCloseAnimation]);

  // Handle escape from screen view
  const handleEscapeScreenView = useCallback(async () => {
    if (!isViewingScreen) return;
    await resetCamera();
  }, [isViewingScreen, resetCamera]);

  // Handle escape from screen zoom view
  useEffect(() => {
    if (!isViewingScreen) return;

    const handleKeyPress = () => {
      // Accept ANY key press to exit screen view
      handleEscapeScreenView();
    };

    const handleClickAnywhere = (e: MouseEvent) => {
      // Exit on ANY click
      e.preventDefault();
      handleEscapeScreenView();
    };

    // Register event listeners with higher priority
    window.addEventListener("keydown", handleKeyPress, { capture: true });
    window.addEventListener("click", handleClickAnywhere, { capture: true });
    document.body.style.cursor = "zoom-out";

    return () => {
      window.removeEventListener("keydown", handleKeyPress, { capture: true });
      window.removeEventListener("click", handleClickAnywhere, {
        capture: true,
      });
      document.body.style.cursor = "default";
    };
  }, [isViewingScreen, handleEscapeScreenView]);

  return {
    isViewingScreen,
    zoomToObject,
    resetCamera,
    setControlsEnabled,
  };
}
