/* useInteractiveObjects Hook
 * Manages raycasting, hover effects, and click handlers for interactive meshes */
import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { InteractiveObject, InteractiveTarget } from "../types/scene.types";

// Types for hook props
interface UseInteractiveObjectsProps {
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  interactiveObjects: Map<string, InteractiveObject> | null;
  onObjectClick?: (target: InteractiveTarget) => void;
  onObjectHover?: (target: InteractiveTarget | null) => void;
}

export function useInteractiveObjects({
  camera,
  renderer,
  interactiveObjects,
  onObjectClick,
  onObjectHover,
}: UseInteractiveObjectsProps) {
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const currentHoveredObject = useRef<InteractiveObject | null>(null);

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
      // (Let Experience.tsx handle the escape)
      const body = document.body;
      if (body.style.cursor === "zoom-out") {
        return; // Don't process clicks when in screen zoom mode
      }

      updateRaycaster(event);
      const intersectedObject = checkIntersections();

      if (intersectedObject) {
        onObjectClick?.(intersectedObject.type);
      }
    },
    [updateRaycaster, checkIntersections, onObjectClick]
  );

  // Setup event listeners
  useEffect(() => {
    if (!renderer) return;

    const canvas = renderer.domElement;

    // Mouse events
    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("click", handleClick);

    // Touch events
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });
    canvas.addEventListener("touchend", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handleClick);

      // Reset cursor
      document.body.style.cursor = "default";
    };
  }, [renderer, handlePointerMove, handleClick]);

  // Get currently hovered object
  const getCurrentHovered = useCallback(() => {
    return currentHoveredObject.current;
  }, []);

  return {
    getCurrentHovered,
    raycaster: raycaster.current,
  };
}
