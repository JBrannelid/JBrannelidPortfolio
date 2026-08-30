/* Zod schema validation (client-side)
 * Netlify Forms integration (SSR-compatible) */

"use client";

import { Github, Linkedin, LoaderCircle, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import { useToasts } from "@/lib/hooks/useToasts";
import { contactSchema } from "@/lib/schema/contactSchema";
import { ContactFormValues, FormSubmissionState } from "@/lib/types";

export default function ContactModalContent() {
  const t = useTranslations("Contact");

  /* Form data state with strict typing */
  const [formData, setFormData] = useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<FormSubmissionState>();
  // Honeypot: hidden field real users never fill in. Kept separate from the
  // Zod-validated form fields and forwarded as-is so the function can drop
  // bot submissions silently.
  const [botField, setBotField] = useState("");

  /* Toast notifications for success/general errors. `submitState.errors`
   * holds i18n keys (see lib/schema/contactSchema.ts), so they're resolved
   * to display text here before reaching useToasts, which just renders
   * whatever strings it's given. */
  useToasts(
    submitState && {
      ...submitState,
      errors: submitState.errors
        ? Object.fromEntries(
            Object.entries(submitState.errors).map(([field, keys]) => [
              field,
              keys?.map((key) => t(key)),
            ])
          )
        : undefined,
    },
    {
      successMessage: t("successToast"),
      duration: 5000,
    }
  );

  /* Handle input change */
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

  /* Handle form submission to Netlify Forms */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState(undefined);

    // Validate with Zod - the resulting fieldErrors are i18n keys (see
    // lib/schema/contactSchema.ts), translated at render time below.
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setSubmitState({ errors: fieldErrors });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to Netlify Function as JSON
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, botField }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Form submission failed");
      }

      /* Success */
      setSubmitState({ success: true });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitState({ errors: { form: ["genericErrorToast"] } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-8">
        <h2 id="modal-title" className="text-soft-black mb-2 font-light">
          {t("title")}
        </h2>
        <div className="divider"></div>
        <p className="text-slate mt-4">{t("intro")}</p>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-6"
        method="post"
        name="contact"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        {/* Hidden input required by Netlify */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot for spam protection - value is forwarded to the
            function via botField and dropped silently if non-empty */}
        <p className="hidden">
          <label>
            {t("honeypotLabel")}
            <input
              name="bot-field"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </p>

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-charcoal mb-2 block font-medium"
          >
            {t("nameLabel")}
            <span className="text-error ml-0.5">*</span>
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
          {submitState?.errors?.name && (
            <p id="name-error" role="alert" className="text-error mt-1 text-sm">
              {t(submitState.errors.name[0])}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="text-charcoal mb-2 block font-medium"
          >
            {t("emailLabel")}
            <span className="text-error ml-0.5">*</span>
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
          {submitState?.errors?.email && (
            <p id="email-error" role="alert" className="text-error mt-1 text-sm">
              {t(submitState.errors.email[0])}
            </p>
          )}
        </div>

        {/* Subject Input */}
        <div>
          <label
            htmlFor="subject"
            className="text-charcoal mb-2 block font-medium"
          >
            {t("subjectLabel")}
            <span className="text-error ml-0.5">*</span>
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
          {submitState?.errors?.subject && (
            <p
              id="subject-error"
              role="alert"
              className="text-error mt-1 text-sm"
            >
              {t(submitState.errors.subject[0])}
            </p>
          )}
        </div>

        {/* Message Textarea */}
        <div>
          <label
            htmlFor="message"
            className="text-charcoal mb-2 block font-medium"
          >
            {t("messageLabel")}
            <span className="text-error ml-0.5">*</span>
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
          {submitState?.errors?.message && (
            <p
              id="message-error"
              role="alert"
              className="text-error mt-1 text-sm"
            >
              {t(submitState.errors.message[0])}
            </p>
          )}
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
                {t("sending")}
              </>
            ) : (
              <>
                <Mail className="mr-2 size-5" />
                {t("sendButton")}
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
          {t("directContactHeading")}
        </h3>
        <div className="space-y-3">
          {/* Email */}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="bg-sand/50 hover:bg-sand transition-smooth group flex items-center gap-3 rounded-lg p-3"
          >
            <div className="bg-ice flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Mail className="text-charcoal size-4" />
            </div>
            <div>
              <p className="text-slate">{t("emailLabel")}</p>
              <p className="text-charcoal font-semibold">
                {CONTACT_INFO.email}
              </p>
            </div>
          </a>

          {/* Location */}
          <div className="bg-sand/50 hover:bg-sand transition-smooth group flex items-center gap-3 rounded-lg p-3">
            <div className="bg-frost flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <MapPin className="text-charcoal size-5" />
            </div>
            <div>
              <p className="text-slate">{t("locationLabel")}</p>
              <p className="text-charcoal font-semibold">
                {CONTACT_INFO.location.city}, {CONTACT_INFO.location.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-charcoal mb-4">{t("socialHeading")}</h3>
        <div className="flex flex-wrap gap-3">
          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Linkedin className="size-4" />
            {t("linkedinButton")}
          </a>

          {/* GitHub */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-charcoal text-warm-white! ease flex transform items-center gap-2 rounded-lg px-4 py-2 transition duration-600 hover:scale-105 hover:opacity-90"
          >
            <Github className="size-4" />
            {t("githubButton")}
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-full my-8"></div>

      {/* Footer Note */}
      <div className="mb-12">
        <p className="text-slate text-center">{t("footerNote")}</p>
      </div>
    </div>
  );
}
