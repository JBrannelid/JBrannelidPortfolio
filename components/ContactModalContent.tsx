"use client";

import { useState, FormEvent } from "react";
import { Mail, LoaderCircle, MapPin, Linkedin, Github } from "lucide-react";
import { useToasts } from "@/lib/hooks/useToasts";

export default function ContactModalContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    errors?: { form?: string[] };
    success?: boolean;
  }>();

  /* Use existing toast hook for notifications */
  useToasts(submitState, {
    successMessage: "Thank you for your message! I'll get back to you soon.",
    duration: 5000,
  });

  /* Handle form input changes */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Handle Netlify form submission */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState(undefined);

    try {
      const formBody = new URLSearchParams({
        "form-name": "contact",
        ...formData,
      }).toString();

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setSubmitState({ success: true });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
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
      {/* Hidden form for Netlify detection (SSR/build-time) */}
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
        {/* Hidden input to identify form for Netlify */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-charcoal mb-2 block font-medium"
          >
            Namn<span className="text-error ml-0.5">*</span>
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
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label
            htmlFor="message"
            className="text-charcoal mb-2 block font-medium"
          >
            Text<span className="text-error ml-0.5">*</span>
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
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
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
              <p className="text-slate">Plats</p>
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
      <p className="text-slate text-center">
        I look forward to hearing from you!
      </p>
    </div>
  );
}
