/**
 * - Zod schema validation (client-side)
 * - Netlify Forms integration (SSR-compatible)
 *
 * Netlify Forms Setup:
 * - Hidden HTML form for build-time detection
 * - JavaScript fetch() for actual submission
 */

"use client";

import { useState, FormEvent } from "react";
import { Mail, LoaderCircle, MapPin, Linkedin, Github } from "lucide-react";
import { useToasts } from "@/lib/hooks/useToasts";
import { contactSchema, ContactFormValues } from "@/lib/schema/contactSchema";

interface FormSubmissionState {
  errors?: Partial<Record<keyof ContactFormValues, string[]>> & {
    form?: string[];
  };
  success?: boolean;
}

export default function ContactModalContent() {
  /* Form data state with strict typing */
  const [formData, setFormData] = useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<FormSubmissionState>();

  /* Toast notifications for success/general errors */
  useToasts(submitState, {
    successMessage: "Thank you for your message!",
    duration: 5000,
  });

  /* Handle input change with error clearing */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear field error when user starts editing
    if (submitState?.errors?.[name as keyof ContactFormValues]) {
      setSubmitState((prev) => ({
        ...prev,
        errors: {
          ...prev?.errors,
          [name]: undefined,
        },
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Handle form submission */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState(undefined);

    /* Step 1: Client-side validation with Zod */
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      // Map Zod errors to our state structure
      const fieldErrors = result.error.flatten().fieldErrors;
      setSubmitState({ errors: fieldErrors });
      return; // Stop here, don't submit to Netlify
    }

    /* Step 2: Submit to Netlify Forms */
    setIsSubmitting(true);

    try {
      // Format data for Netlify (application/x-www-form-urlencoded)
      const formBody = new URLSearchParams({
        "form-name": "contact", // Must match hidden form name
        ...result.data, // Use validated data (trimmed, lowercase email, etc.)
      }).toString();

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      /* Success: Show toast and reset form */
      setSubmitState({ success: true });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);

      /* Error: Show toast notification */
      setSubmitState({
        errors: {
          form: [
            "Something went wrong. Please try again or contact me directly via email.",
          ],
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-12">
      {/* NETLIFY - Hidden HTML form for build-time detection */}
      <form name="contact" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="subject" />
        <textarea name="message"></textarea>
      </form>

      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2 font-light">
          Contact Me
        </h2>
        <div className="divider"></div>
        <p className="text-slate mt-4">
          Do you have an idea or a project? I look forward to hearing from you!
        </p>
      </div>

      {/* Contact Form - Netlify enabled */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-charcoal mb-2 block font-medium"
          >
            Name<span className="text-error ml-0.5">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            disabled={isSubmitting}
            aria-invalid={!!submitState?.errors?.name}
            aria-describedby={
              submitState?.errors?.name ? "name-error" : undefined
            }
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="text-charcoal mb-2 block font-medium"
          >
            Email<span className="text-error ml-0.5">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            disabled={isSubmitting}
            aria-invalid={!!submitState?.errors?.email}
            aria-describedby={
              submitState?.errors?.email ? "email-error" : undefined
            }
          />
        </div>

        {/* Subject Input */}
        <div>
          <label
            htmlFor="subject"
            className="text-charcoal mb-2 block font-medium"
          >
            Subject<span className="text-error ml-0.5">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="input"
            disabled={isSubmitting}
            aria-invalid={!!submitState?.errors?.subject}
            aria-describedby={
              submitState?.errors?.subject ? "subject-error" : undefined
            }
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label
            htmlFor="message"
            className="text-charcoal mb-2 block font-medium"
          >
            Message<span className="text-error ml-0.5">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="textarea"
            disabled={isSubmitting}
            aria-invalid={!!submitState?.errors?.message}
            aria-describedby={
              submitState?.errors?.message ? "message-error" : undefined
            }
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 size-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 size-5" />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="divider-full my-8"></div>

      {/* Direct Contact Info */}
      <div className="mb-8">
        <h3 className="text-charcoal mb-4 text-xl font-medium">
          Direct contact
        </h3>
        <div className="space-y-3">
          {/* Email */}
          <a
            href="mailto:J.Brannelid@icloud.com"
            className="bg-sand/50 hover:bg-sand transition-smooth group flex items-center gap-3 rounded-lg p-3"
          >
            <div className="bg-ice flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Mail className="text-charcoal size-4" />
            </div>
            <div>
              <p className="text-slate">Email</p>
              <p className="text-charcoal font-semibold">
                J.Brannelid@icloud.com
              </p>
            </div>
          </a>

          {/* Location */}
          <div className="bg-sand/50 hover:bg-sand transition-smooth group flex items-center gap-3 rounded-lg p-3">
            <div className="bg-frost flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <MapPin className="text-charcoal size-5" />
            </div>
            <div>
              <p className="text-slate">Location</p>
              <p className="text-charcoal font-semibold">Stockholm, Sweden</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-charcoal mb-4">Follow me on social media</h3>
        <div className="flex flex-wrap gap-3">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/johannes-brannelid/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Linkedin className="size-4" />
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/JBrannelid"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-full my-8"></div>

      {/* Footer Note */}
      <div className="mb-5">
        <p className="text-slate text-center">
          I look forward to hearing from you!
        </p>
      </div>
    </div>
  );
}
