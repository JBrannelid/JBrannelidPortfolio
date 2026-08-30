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
      // Exit on ANY click - stopped here so it can't also reach the
      // canvas's own raycasting click handler and fire a second, competing
      // zoom-in animation from the same click.
      e.preventDefault();
      e.stopPropagation();
      handleEscapeScreenView();
    };

    // Touch equivalent of handleClickAnywhere - needed as its own listener
    // rather than relying on the browser's trailing synthetic "click" after
    // a tap: useInteractiveObjects' touchend handler calls preventDefault()
    // on every recognized tap specifically to suppress that synthetic click
    // (it was the source of a mobile zoom-in glitch), which as a side
    // effect means no "click" event ever reaches this listener on touch
    // devices. Listening for touchend directly here exits reliably on
    // mobile regardless.
    const handleTouchEndAnywhere = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleEscapeScreenView();
    };

    // Register event listeners with higher priority
    window.addEventListener("keydown", handleKeyPress, { capture: true });
    window.addEventListener("click", handleClickAnywhere, { capture: true });
    window.addEventListener("touchend", handleTouchEndAnywhere, {
      capture: true,
    });
    document.body.style.cursor = "zoom-out";

    return () => {
      window.removeEventListener("keydown", handleKeyPress, { capture: true });
      window.removeEventListener("click", handleClickAnywhere, {
        capture: true,
      });
      window.removeEventListener("touchend", handleTouchEndAnywhere, {
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
