/* Manages raycasting, hover effects, and click handlers for interactive meshes */
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

import {
  InteractiveObject,
  UseInteractiveObjectsProps,
  UseInteractiveObjectsResult,
} from "@/lib/types";

// Drags that rotate the camera (via OrbitControls, listening independently
// on the same canvas) can end over an interactive object - both the native
// "click" event and touchend still fire in that case. Anything past this
// distance between press and release is a drag, not a tap/click, and must
// not open a modal.
const TAP_MOVE_THRESHOLD_PX = 10;

export function useInteractiveObjects({
  camera,
  renderer,
  interactiveObjects,
  onObjectClick,
  onObjectHover,
}: UseInteractiveObjectsProps): UseInteractiveObjectsResult {
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const currentHoveredObject = useRef<InteractiveObject | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  // Update raycaster with current pointer position
  const updateRaycaster = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!renderer) return;

      const canvas = renderer.domElement;
      const rect = canvas.getBoundingClientRect();

      let clientX: number;
      let clientY: number;

      if (event instanceof TouchEvent) {
        clientX = event.touches[0]?.clientX ?? event.changedTouches[0].clientX;
        clientY = event.touches[0]?.clientY ?? event.changedTouches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      // Convert to normalized device coordinates (-1 to +1)
      pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    },
    [renderer]
  );

  // Check for intersections with interactive objects
  const checkIntersections = useCallback(() => {
    if (!camera || !interactiveObjects || interactiveObjects.size === 0) {
      return null;
    }

    raycaster.current.setFromCamera(pointer.current, camera);

    // Get all interactive meshes
    const meshes = Array.from(interactiveObjects.values()).map(
      (obj) => obj.mesh
    );

    // Check for intersections
    const intersects = raycaster.current.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object as THREE.Mesh;
      const interactiveObj = interactiveObjects.get(intersectedMesh.name);
      return interactiveObj || null;
    }

    return null;
  }, [camera, interactiveObjects]);

  // Handle pointer move - update hover state
  const handlePointerMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      updateRaycaster(event);
      const intersectedObject = checkIntersections();

      // Update hover state
      if (intersectedObject !== currentHoveredObject.current) {
        // Clear previous hover
        if (currentHoveredObject.current) {
          currentHoveredObject.current.isHovered = false;
          document.body.style.cursor = "default";
        }

        // Set new hover
        currentHoveredObject.current = intersectedObject;

        if (intersectedObject) {
          intersectedObject.isHovered = true;
          document.body.style.cursor = "pointer";
          onObjectHover?.(intersectedObject.type);
        } else {
          onObjectHover?.(null);
        }
      }
    },
    [updateRaycaster, checkIntersections, onObjectHover]
  );

  // Handle click - trigger action for interactive object
  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Skip raycaster interaction if in screen view mode
      const body = document.body;
      if (body.style.cursor === "zoom-out") {
        return; // Don't process clicks when in screen zoom mode
      }

      // The native "click" event still fires after a mouse-drag that
      // rotated the camera - ignore it if press and release were far apart.
      if (event instanceof MouseEvent) {
        const start = mouseDownPos.current;
        if (
          start &&
          Math.hypot(event.clientX - start.x, event.clientY - start.y) >
            TAP_MOVE_THRESHOLD_PX
        ) {
          return;
        }
      }

      updateRaycaster(event);
      const intersectedObject = checkIntersections();

      if (intersectedObject) {
        onObjectClick?.(intersectedObject.type);
      }
    },
    [updateRaycaster, checkIntersections, onObjectClick]
  );

  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseDownPos.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartPos.current = touch
      ? { x: touch.clientX, y: touch.clientY }
      : null;
  }, []);

  // Touch equivalent of handleClick - only fires if the finger didn't move
  // (a camera-rotation drag ending over an object must not open its modal)
  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      const start = touchStartPos.current;
      touchStartPos.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const distance = Math.hypot(
        touch.clientX - start.x,
        touch.clientY - start.y
      );
      if (distance > TAP_MOVE_THRESHOLD_PX) return;

      handleClick(event);
    },
    [handleClick]
  );

  // Setup event listeners
  useEffect(() => {
    if (!renderer) return;

    const canvas = renderer.domElement;

    // Mouse events
    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("click", handleClick);

    // Touch events
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);

      // Reset cursor
      document.body.style.cursor = "default";
    };
  }, [
    renderer,
    handlePointerMove,
    handleMouseDown,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
  ]);

  // Get currently hovered object
  const getCurrentHovered = useCallback(() => {
    return currentHoveredObject.current;
  }, []);

  return {
    getCurrentHovered,
    raycaster: raycaster.current,
  };
}
