import { z } from "zod";

// Message values are i18n keys (under the "Contact.errors" namespace in
// messages/{locale}.json), not literal English text - the UI renders
// t(issue.message) so validation feedback is localized. This schema stays
// the single source of validation *rules*, reused as-is by the Netlify
// Function for server-side re-validation, which never needs to display
// these messages to an end user.
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "errors.name.min" })
    .max(100, { message: "errors.name.max" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "errors.name.pattern" }),
  email: z
    .string()
    .email({ message: "errors.email.invalid" })
    .max(255, { message: "errors.email.max" })
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, { message: "errors.subject.min" })
    .max(200, { message: "errors.subject.max" })
    .trim(),
  message: z
    .string()
    .min(10, { message: "errors.message.min" })
    .max(2000, { message: "errors.message.max" })
    .trim(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
