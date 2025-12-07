/* Contact Form Schema */
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes.",
    }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must not exceed 255 characters." })
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." })
    .max(200, { message: "Subject must not exceed 200 characters." })
    .trim(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(2000, { message: "Message must not exceed 2000 characters." })
    .trim(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
