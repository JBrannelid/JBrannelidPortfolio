"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

/* Generic state interface for form validation results */
interface GenericState {
  errors?: {
    [key: string]: string[] | undefined;
    form?: string[];
  };
  success?: boolean;
}

/* Toast configuration options */
interface ToastOptions {
  successMessage?: string;
  duration?: number;
}

/** useToasts Hook
 *
 * Handles toast notifications for form states, showing:
 * - Error messages that persist until dismissed
 * - Success messages that auto-dismiss
 */
export const useToasts = (
  state: GenericState | undefined,
  options?: ToastOptions
) => {
  const { successMessage = "Success", duration = 5000 } = options || {};

  useEffect(() => {
    if (!state) return;

    /* Handle form and field validation errors from server */
    if (state.errors) {
      Object.keys(state.errors).forEach((key) => {
        state.errors![key]?.forEach((errorMessage) => {
          const id = toast(
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex items-center gap-2">
                <span className="text-error">{errorMessage}</span>
              </div>
              <div
                className="border-error text-error shrink-0 transform cursor-pointer rounded-full border bg-red-50 p-1 transition hover:scale-105 hover:bg-red-100"
                onClick={() => toast.dismiss(id)}
              >
                <X size={13} />
              </div>
            </div>,
            {
              duration: Infinity,
              className: "bg-white text-black shadow-md",
              icon: null,
            }
          );
        });
      });
    }

    /* Handle success messages - auto-dismiss after duration */
    if (state.success) {
      toast(
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <span className="text-green-500">{successMessage}</span>
          </div>
        </div>,
        {
          duration,
          className: "bg-white text-black shadow-md",
          icon: null,
        }
      );
    }
  }, [state, successMessage, duration]);
};
