/* Main Three.js Scene
 * Manages the 3D interactive portfolio experience with:
 * - Three.js scene setup and rendering
 * - Interactive object detection and animations
 * - Modal state management
 * - Screen view mode with escape functionality
 */

"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useInteractiveObjects } from "@/lib/hooks/useInteractiveObjects";
import { useModelLoader } from "@/lib/hooks/useModelLoader";
import { useGSAPAnimations } from "@/lib/hooks/useGSAPAnimations";
import { SceneSetup } from "@/lib/three/setup/SceneSetup";
import {
  InteractiveObject,
  InteractiveTarget,
  ModalType,
} from "@/lib/types/scene.types";

import Modal from "@/components/Modal";
import AboutModalContent from "@/components/AboutModalContent";
import ContactModalContent from "@/components/ContactModalContent";
import CVModalContent from "@/components/CVModalContent";
import ExternalLinkModal from "@/components/ExternalLinkModal";
import ExperienceLoader from "./ExperienceLoader";
import Navigation from "@/components/Navigation";
import { useModalManager } from "@/lib/hooks/useModalManager";

// TYPES AND CONSTANTS

/* Mapping from interactive targets to modal types
 * Used for routing click events to appropriate modal content */
const MODAL_MAP: Partial<Record<InteractiveTarget, ModalType>> = {
  [InteractiveTarget.About]: ModalType.About,
  [InteractiveTarget.Contact]: ModalType.Contact,
  [InteractiveTarget.CV]: ModalType.CV,
};

/* Strongly-typed reference container for Three.js instances
 * Prevents null checks throughout the component */
interface ThreeRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  sceneSetup: SceneSetup;
  animationFrameId: number | null;
}

// MAIN COMPONENT
export default function Experience() {
  // Three.js instance container - holds all core objects
  const threeRefs = useRef<ThreeRefs | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasHadModalOpen = useRef(false);
  const lastHoveredObject = useRef<InteractiveObject | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isViewingScreen, setIsViewingScreen] = useState(false);
  const currentViewedTarget = useRef<InteractiveTarget | null>(null);

  // External link confirmation modal state
  const [externalLink, setExternalLink] = useState<{
    url: string;
    siteName: string;
  } | null>(null);

  // Modal state management
  const { openModal, closeModal, isModalOpen, currentModal } =
    useModalManager();

  // DERIVED STATE (Performance optimized)
  const sceneRef = isSceneReady ? threeRefs.current?.scene || null : null;
  const cameraRef = isSceneReady ? threeRefs.current?.camera || null : null;
  const rendererRef = isSceneReady ? threeRefs.current?.renderer || null : null;
  const controlsRef = isSceneReady ? threeRefs.current?.controls || null : null;

  // Load 3D model and extract interactive objects
  const { model, isLoading, error, progress } = useModelLoader(sceneRef);

  // THREE.JS SETUP - Initialize scene, camera, renderer, controls
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

    // Notify React that Three.js is ready for dependent hooks
    setIsSceneReady(true);
    const handleResize = () => {
      const refs = threeRefs.current;
      if (!refs) return;
      refs.sceneSetup.onResize(refs.camera, refs.renderer);
    };

    window.addEventListener("resize", handleResize);

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
      setIsSceneReady(false);
    };
  }, []);

  //  GSAP ANIMATIONS - Setup hover, click, and modal animations
  const {
    createHoverAnimation,
    createHoverOutAnimation,
    createClickAnimation,
    createModalCloseAnimation,
    setControlsEnabled,
  } = useGSAPAnimations({
    interactiveObjects: model?.interactiveObjects || null,
    scene: sceneRef,
    camera: cameraRef,
    controls: controlsRef,
  });

  // SCREEN VIEW ESCAPE FUNCTIONALITY
  // Handle escape from screen zoom view
  const handleEscapeScreenView = useCallback(async () => {
    if (!isViewingScreen) return;

    setIsViewingScreen(false);
    currentViewedTarget.current = null;

    // Smoothly return camera to original position
    await createModalCloseAnimation();
  }, [isViewingScreen, createModalCloseAnimation]);

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

  //  MODAL AND CONTROLS STATE MANAGEMENT
  // Disable OrbitControls when modal or external link is open
  useEffect(() => {
    const isModalOrLinkOpen = currentModal !== null || externalLink !== null;
    setControlsEnabled(!isModalOrLinkOpen);

    // Track if any modal has been opened during session
    if (isModalOrLinkOpen) {
      hasHadModalOpen.current = true;
    }

    // Reset camera when closing modals/links
    if (!isModalOrLinkOpen && hasHadModalOpen.current && isSceneReady) {
      createModalCloseAnimation();
    }
  }, [
    currentModal,
    externalLink,
    setControlsEnabled,
    createModalCloseAnimation,
    isSceneReady,
  ]);

  // INTERACTION HANDLERS
  //  Handle click on interactive 3D object
  const handleObjectClick = useCallback(
    async (target: InteractiveTarget) => {
      const refs = threeRefs.current;
      if (!model?.interactiveObjects || !refs) return;

      // Find the clicked object in the interactive objects map
      const clickedObject = Array.from(model.interactiveObjects.values()).find(
        (obj) => obj.type === target
      );

      if (!clickedObject) {
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
      await createClickAnimation(clickedObject);

      // Handle post-zoom actions (modals or external links)
      if (!isScreen) {
        const modalType = MODAL_MAP[target];

        if (modalType) {
          // Open corresponding modal
          openModal(modalType);
        } else {
          // Handle external links with confirmation modal
          switch (target) {
            case InteractiveTarget.GitHub:
              setExternalLink({
                url: "https://github.com/JBrannelid",
                siteName: "GitHub",
              });
              break;
            case InteractiveTarget.LinkedIn:
              setExternalLink({
                url: "https://www.linkedin.com/in/johannes-brannelid/",
                siteName: "LinkedIn",
              });
              break;
          }
        }
      }
    },
    [model, createClickAnimation, openModal]
  );

  // Handle hover on interactive 3D object
  const handleObjectHover = useCallback(
    (target: InteractiveTarget | null) => {
      if (!model?.interactiveObjects) return;

      if (target) {
        // Reset previous hovered object first
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

  //  RAYCASTING SETUP - Detect mouse interaction with 3D objects
  useInteractiveObjects({
    camera: cameraRef,
    renderer: rendererRef,
    interactiveObjects: model?.interactiveObjects || null,
    onObjectClick: handleObjectClick,
    onObjectHover: handleObjectHover,
  });

  // RENDER LOOP - Only runs when scene is ready
  useEffect(() => {
    if (!isSceneReady) return;

    const { controls, renderer, scene, camera } = threeRefs.current!;
    const animate = () => {
      if (threeRefs.current) {
        threeRefs.current.animationFrameId = requestAnimationFrame(animate);
      }

      // Update controls for damping effect
      controls.update();

      // Render frame
      renderer.render(scene, camera);
    };

    // Start animation loop
    animate();

    // Cleanup: Cancel animation frame on unmount
    return () => {
      if (threeRefs.current && threeRefs.current.animationFrameId !== null) {
        cancelAnimationFrame(threeRefs.current.animationFrameId);
      }
    };
  }, [isSceneReady]);

  // MODAL CONTENT COMPONENT SELECTOR
  // Memoized modal content select and return child component
  const ModalContentComponent = useMemo(() => {
    if (!currentModal) return null;

    switch (currentModal) {
      case ModalType.About:
        return AboutModalContent;
      case ModalType.Contact:
        return ContactModalContent;
      case ModalType.CV:
        return CVModalContent;
      default:
        return null;
    }
  }, [currentModal]);

  // EXTERNAL LINK HANDLERS
  const handleExternalLinkCancel = useCallback(() => {
    setExternalLink(null);
  }, []);

  // Handle external link confirmation
  const handleExternalLinkConfirm = useCallback(() => {
    if (!externalLink) return;

    window.open(externalLink.url, "_blank");
    setExternalLink(null);
  }, [externalLink]);

  // NAVIGATION HANDLERS - Called from Navigation component buttons
  const handleNavAboutClick = useCallback(async () => {
    if (!model?.interactiveObjects) return;

    // Find the About 3D object
    const aboutObject = model.interactiveObjects.get(InteractiveTarget.About);
    if (aboutObject) {
      // Animate camera to object first
      await createClickAnimation(aboutObject);
    }
    // Then open modal
    openModal(ModalType.About);
  }, [model, createClickAnimation, openModal]);

  const handleNavCVClick = useCallback(async () => {
    if (!model?.interactiveObjects) return;

    // Find the CV 3D object
    const cvObject = model.interactiveObjects.get(InteractiveTarget.CV);
    if (cvObject) {
      // Animate camera to object first
      await createClickAnimation(cvObject);
    }
    // Then open modal
    openModal(ModalType.CV);
  }, [model, createClickAnimation, openModal]);

  const handleNavContactClick = useCallback(async () => {
    if (!model?.interactiveObjects) return;

    // Find the Contact 3D object
    const contactObject = model.interactiveObjects.get(
      InteractiveTarget.Contact
    );
    if (contactObject) {
      // Animate camera to object first
      await createClickAnimation(contactObject);
    }
    // Then open modal
    openModal(ModalType.Contact);
  }, [model, createClickAnimation, openModal]);

  const handleNavGitHubClick = useCallback(async () => {
    if (!model?.interactiveObjects) return;

    // Find the GitHub 3D object
    const githubObject = model.interactiveObjects.get(InteractiveTarget.GitHub);
    if (githubObject) {
      // Animate camera to object first
      await createClickAnimation(githubObject);
    }
    // Then show external link confirmation
    setExternalLink({
      url: "https://github.com/JBrannelid",
      siteName: "GitHub",
    });
  }, [model, createClickAnimation]);

  const handleNavLinkedInClick = useCallback(async () => {
    if (!model?.interactiveObjects) return;

    // Find the LinkedIn 3D object
    const linkedinObject = model.interactiveObjects.get(
      InteractiveTarget.LinkedIn
    );
    if (linkedinObject) {
      // Animate camera to object first
      await createClickAnimation(linkedinObject);
    }
    // Then show external link confirmation
    setExternalLink({
      url: "https://www.linkedin.com/in/johannes-brannelid/",
      siteName: "LinkedIn",
    });
  }, [model, createClickAnimation]);

  return (
    <>
      {/* Three.js Canvas - Fixed fullscreen background */}
      <canvas
        ref={canvasRef}
        id="experience-canvas"
        className="fixed inset-0 z-0 h-full w-full"
      />

      {/* Loading Screen - Shows progress during model load */}
      <ExperienceLoader
        isLoading={isLoading}
        error={error}
        progress={progress}
      />

      {/* Modal System - About, Contact, CV */}
      {currentModal && ModalContentComponent && (
        <Modal isOpen={isModalOpen(currentModal)} onClose={closeModal}>
          <ModalContentComponent />
        </Modal>
      )}

      {/* External Link Confirmation Modal - GitHub, LinkedIn */}
      {externalLink && (
        <ExternalLinkModal
          isOpen={Boolean(externalLink)}
          url={externalLink.url}
          siteName={externalLink.siteName}
          onConfirm={handleExternalLinkConfirm}
          onCancel={handleExternalLinkCancel}
        />
      )}

      {/* Navigation - Sidebar on desktop, Header on mobile */}
      <Navigation
        onAboutClick={handleNavAboutClick}
        onCVClick={handleNavCVClick}
        onContactClick={handleNavContactClick}
        onGitHubClick={handleNavGitHubClick}
        onLinkedInClick={handleNavLinkedInClick}
      />
    </>
  );
}
