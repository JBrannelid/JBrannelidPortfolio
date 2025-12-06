"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { ModalType } from "@/lib/types/scene.types";

/* Reusable Modal Component
 * Child components: AboutModalContent, ContactModalContent, CVModalContent
 */

interface ModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({ type, isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Animate modal open/close with GSAP */
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Show modal with animation
      const timeline = gsap.timeline();

      timeline
        .set([overlayRef.current, modalRef.current], { display: "flex" })
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        )
        .fromTo(
          contentRef.current,
          {
            opacity: 0,
            scale: 0.8,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
    } else {
      // Re-enable body scroll
      document.body.style.overflow = "";

      // Hide modal with animation
      const timeline = gsap.timeline();

      timeline
        .to(contentRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          "-=0.1"
        )
        .set([overlayRef.current, modalRef.current], { display: "none" });
    }
  }, [isOpen]);

  /* Handle escape key press - close modal */
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  /* Handle overlay click (close modal when clicking outside) */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="bg-soft-black/60 fixed inset-0 z-50 hidden items-center justify-center p-4 backdrop-blur-sm"
        style={{ display: "none" }}
      >
        {/* Modal Container */}
        <div
          ref={modalRef}
          className="relative hidden max-h-4/5 w-full max-w-2xl"
          style={{ display: "none" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Content */}
          <div
            ref={contentRef}
            className={`bg-warm-white border-sage relative overflow-hidden rounded-lg border-2 shadow-2xl`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="group absolute top-4 right-4 z-50 flex size-10 transform items-center justify-center rounded-full bg-[#d4cfc5] transition-all duration-200 hover:scale-105"
              aria-label="Close modal"
            >
              <X className="text-moss group-hover:text-moss-dark size-6 transition-colors duration-200" />
            </button>

            {/* Scrollable Content */}
            <div className="custom-scrollbar max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
