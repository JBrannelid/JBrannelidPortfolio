/* ExternalLinkModal Component
 * Confirmation dialog for external navigation (LinkedIn / GitHub)
 */

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LogOut } from "lucide-react";

interface ExternalLinkModalProps {
  isOpen: boolean;
  url: string;
  siteName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExternalLinkModal({
  isOpen,
  url,
  siteName,
  onConfirm,
  onCancel,
}: ExternalLinkModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  /* GSAP - Animate modal open/close */
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      const timeline = gsap.timeline();
      timeline
        .set([overlayRef.current, modalRef.current], { display: "flex" })
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" }
        )
        .fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "back.out(1.4)",
          },
          "-=0.1"
        );
    } else {
      document.body.style.overflow = "";

      const timeline = gsap.timeline();
      timeline
        .to(modalRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 10,
          duration: 0.2,
          ease: "power2.in",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in",
          },
          "-=0.1"
        )
        .set([overlayRef.current, modalRef.current], { display: "none" });
    }
  }, [isOpen]);

  /* Handle escape with event listener to close an open Modal */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  return (
    <div
      ref={overlayRef}
      className="bg-soft-black/70 fixed inset-0 z-50 hidden items-center justify-center p-4 backdrop-blur-sm"
      onClick={onCancel}
      style={{ display: "none" }}
    >
      <div
        ref={modalRef}
        className="bg-warm-white relative hidden max-w-md rounded-lg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ display: "none" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-link-title"
      >
        <div className="flex flex-col items-center justify-center">
          {/* Icon */}
          <div className="bg-ice/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <LogOut className="text-moss size-6" />
          </div>

          {/* Title */}
          <h3
            id="external-link-title"
            className="text-charcoal mb-2 text-center font-bold"
          >
            Leave Site?
          </h3>

          {/* Site Name */}
          <div className="bg-sand/50 mb-4 rounded-lg p-3">
            <p className="text-center font-bold text-blue-600!">{siteName}</p>
            <p className="text-slate mt-1 text-center break-all">{url}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-primary">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
