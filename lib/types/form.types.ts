/**
 * Form Type Definitions
 * All form-related types and interfaces including validation states
 */

import { z } from "zod";
import { contactSchema } from "@/lib/schema/contactSchema";

export type ContactFormValues = z.infer<typeof contactSchema>;

export interface FormSubmissionState {
  errors?: Partial<Record<keyof ContactFormValues, string[]>> & {
    form?: string[];
  };
  success?: boolean;
}

export interface GenericFormState {
  errors?: {
    [key: string]: string[] | undefined;
    form?: string[];
  };
  success?: boolean;
}

export interface ToastOptions {
  successMessage?: string;
  duration?: number;
}
