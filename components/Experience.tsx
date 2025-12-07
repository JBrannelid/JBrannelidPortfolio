/* Main component tying together the 3D experience
 * Architecture:
 * - Scene: Handles Three.js setup and rendering
 * - InteractionManager: Manages raycasting and interactions
 * - useCameraController: Controls camera animations
 * - useModalManager: Manages modal state
 * - useModelLoader: Loads 3D model
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useModelLoader } from "@/lib/hooks/useModelLoader";
import { useModalManager } from "@/lib/hooks/useModalManager";
import { useCameraController } from "@/lib/hooks/useCameraController";
import { InteractiveTarget, ModalType, ThreeSceneRefs } from "@/lib/types";
import { MODAL_MAP, EXTERNAL_LINKS } from "@/lib/constants";

import Scene from "@/components/three/Scene";
import InteractionManager from "@/components/three/InteractionManager";
import ExperienceLoader from "@/components/three/ExperienceLoader";
import Modal from "@/components/ui/Modal";
import Navigation from "@/components/ui/Navigation";
import ExternalLinkModal from "@/components/modals/ExternalLinkModal";
import AboutModalContent from "@/components/modals/AboutModalContent";
import ContactModalContent from "@/components/modals/ContactModalContent";
import CVModalContent from "@/components/modals/CVModalContent";

// This is the main component. Ties all together, manage states and handlers
// This component renders from layout level
export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasHadModalOpen = useRef(false);

  const [sceneRefs, setSceneRefs] = useState<ThreeSceneRefs | null>(null);

  const [externalLink, setExternalLink] = useState<{
    url: string;
    siteName: string;
  } | null>(null);

  // Modal state management
  const { openModal, closeModal, isModalOpen, currentModal } =
    useModalManager();

  // Load 3D model
  const { model, isLoading, error, progress } = useModelLoader(
    sceneRefs?.scene || null
  );

  // Camera controller
  const { zoomToObject, resetCamera, setControlsEnabled } = useCameraController(
    {
      model,
      camera: sceneRefs?.camera || null,
      scene: sceneRefs?.scene || null,
      controls: sceneRefs?.controls || null,
    }
  );

  // Handle scene ready callback
  const handleSceneReady = useCallback((refs: ThreeSceneRefs) => {
    setSceneRefs(refs);
  }, []);

  // State management for tracking if any modal has been opened during session
  // Disable controls when modal or link is open
  useEffect(() => {
    const isModalOrLinkOpen = currentModal !== null || externalLink !== null;
    setControlsEnabled(!isModalOrLinkOpen);

    // Track if any modal has been opened during session
    if (isModalOrLinkOpen) {
      hasHadModalOpen.current = true;
    }

    // Reset camera when closing modals/links (if something has been opened before)
    if (!isModalOrLinkOpen && hasHadModalOpen.current) {
      resetCamera();
    }
  }, [currentModal, externalLink, setControlsEnabled, resetCamera]);

  // Interaction Handler - Handle click on interactive 3D object
  const handleObjectClick = useCallback(
    async (target: InteractiveTarget) => {
      // Check if this is a screen object
      const isScreen =
        target === InteractiveTarget.TVScreen ||
        target === InteractiveTarget.ComputerScreen;

      // Zoom to target
      await zoomToObject(target);

      // Handle post-zoom actions (modals or external links)
      if (!isScreen) {
        const modalType = MODAL_MAP[target];

        if (modalType) {
          // Open corresponding modal
          openModal(modalType);
        } else {
          // Handle external links
          const linkConfig =
            EXTERNAL_LINKS[target as keyof typeof EXTERNAL_LINKS];
          if (linkConfig) {
            setExternalLink(linkConfig);
          }
        }
      }
    },
    [zoomToObject, openModal]
  );

  // Modal content component, memoized and selected based on current modal type
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

  // External link modal handlers
  const handleExternalLinkCancel = useCallback(() => {
    setExternalLink(null);
    // Camera reset is handled by useEffect
  }, []);

  const handleExternalLinkConfirm = useCallback(() => {
    if (!externalLink) return;
    window.open(externalLink.url, "_blank");
    setExternalLink(null);
    // Camera reset is handled by useEffect
  }, [externalLink]);

  // Generic handler for navigation clicks
  const handleNavClick = useCallback(
    async (target: InteractiveTarget, modalType?: ModalType) => {
      await zoomToObject(target);
      if (modalType) {
        openModal(modalType);
      }
    },
    [zoomToObject, openModal]
  );

  const handleNavAboutClick = useCallback(
    () => handleNavClick(InteractiveTarget.About, ModalType.About),
    [handleNavClick]
  );

  const handleNavCVClick = useCallback(
    () => handleNavClick(InteractiveTarget.CV, ModalType.CV),
    [handleNavClick]
  );

  const handleNavContactClick = useCallback(
    () => handleNavClick(InteractiveTarget.Contact, ModalType.Contact),
    [handleNavClick]
  );

  const handleNavGitHubClick = useCallback(async () => {
    await zoomToObject(InteractiveTarget.GitHub);
    setExternalLink(EXTERNAL_LINKS[InteractiveTarget.GitHub]);
  }, [zoomToObject]);

  const handleNavLinkedInClick = useCallback(async () => {
    await zoomToObject(InteractiveTarget.LinkedIn);
    setExternalLink(EXTERNAL_LINKS[InteractiveTarget.LinkedIn]);
  }, [zoomToObject]);

  // Handle modal/link close - reset camera
  const handleModalClose = useCallback(() => {
    closeModal();
    // Camera reset is handled by useEffect
  }, [closeModal]);

  return (
    <>
      {/* Three.js Canvas - Fixed fullscreen background */}
      <canvas
        ref={canvasRef}
        id="experience-canvas"
        className="fixed inset-0 z-0 h-full w-full"
      />

      {/* Scene Setup - Three.js initialization */}
      <Scene canvasRef={canvasRef} onSceneReady={handleSceneReady} />

      {/* Interaction Manager - Raycasting and interactions */}
      {sceneRefs && (
        <InteractionManager
          model={model}
          camera={sceneRefs.camera}
          renderer={sceneRefs.renderer}
          scene={sceneRefs.scene}
          controls={sceneRefs.controls}
          onObjectClick={handleObjectClick}
        />
      )}

      {/* Loading Screen - Shows progress during model load */}
      <ExperienceLoader
        isLoading={isLoading}
        error={error}
        progress={progress}
      />

      {/* Modal Component (About, Contact, CV) */}
      {currentModal && ModalContentComponent && (
        <Modal isOpen={isModalOpen(currentModal)} onClose={handleModalClose}>
          <ModalContentComponent />
        </Modal>
      )}

      {/* External Link Confirmation Modal (GitHub, LinkedIn) */}
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
