/* Manages raycasting, hover effects, and click handlers for 3D objects  */
"use client";

import { useCallback, useRef } from "react";
import { useInteractiveObjects } from "@/lib/hooks/useInteractiveObjects";
import { useGSAPAnimations } from "@/lib/hooks/useGSAPAnimations";
import {
  InteractiveObject,
  InteractiveTarget,
  InteractionManagerProps,
} from "@/lib/types";

export default function InteractionManager({
  model,
  camera,
  renderer,
  scene,
  controls,
  onObjectClick,
}: InteractionManagerProps) {
  const lastHoveredObject = useRef<InteractiveObject | null>(null);

  // GSAP - Setup hover, click, and modal animations
  const { createHoverAnimation, createHoverOutAnimation } = useGSAPAnimations({
    interactiveObjects: model?.interactiveObjects || null,
    scene,
    camera,
    controls,
  });

  // Handle hover on interactive 3D object
  const handleObjectHover = useCallback(
    (target: InteractiveTarget | null) => {
      if (!model?.interactiveObjects) return;

      if (target) {
        // Reset previous hovered object
        if (lastHoveredObject.current) {
          createHoverOutAnimation(lastHoveredObject.current);
        }

        // Find and animate new hovered object
        const hoveredObject = Array.from(
          model.interactiveObjects.values()
        ).find((obj) => obj.type === target);

        if (hoveredObject) {
          createHoverAnimation(hoveredObject);
          lastHoveredObject.current = hoveredObject;
        }
      } else {
        // Reset the last hovered object when hover ends
        if (lastHoveredObject.current) {
          createHoverOutAnimation(lastHoveredObject.current);
          lastHoveredObject.current = null;
        }
      }
    },
    [model, createHoverAnimation, createHoverOutAnimation]
  );

  // Raycasting - Detect mouse interaction with 3D objects
  useInteractiveObjects({
    camera,
    renderer,
    interactiveObjects: model?.interactiveObjects || null,
    onObjectClick,
    onObjectHover: handleObjectHover,
  });

  return null; // This component doesn't render anything itself
}
