import { Handler } from "@netlify/functions";
import { z } from "zod";

import { contactSchema } from "../../lib/schema/contactSchema";

// Netlify injects this at build/runtime with the site's own primary URL -
// never derive the submission target from request headers (that would let a
// caller redirect our outbound POST to an arbitrary URL of their choosing).
const SITE_URL = process.env.URL || "https://jbrannelid.com";

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Honeypot: real users never populate this hidden field. Silently
    // report success without forwarding anything to Netlify Forms.
    if (typeof data.botField === "string" && data.botField.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    // Re-validate with the same Zod schema the client uses - the client-side
    // check is only a UX convenience and can't be trusted, since this
    // endpoint can be called directly with an arbitrary body.
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid form data",
          fieldErrors: z.flattenError(result.error).fieldErrors,
        }),
      };
    }

    const { name, email, subject, message } = result.data;

    // Encode for Netlify Forms - use the static form page
    const formData = new URLSearchParams({
      "form-name": "contact",
      name,
      email,
      subject,
      message,
    });

    // POST to the actual static HTML form page that Netlify knows about
    const submissionUrl = `${SITE_URL}/forms.html`;

    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Netlify Forms submission failed:",
        response.status,
        errorText
      );
      throw new Error("Form submission failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
