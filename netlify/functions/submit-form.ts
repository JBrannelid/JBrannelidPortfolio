import { Handler } from "@netlify/functions";

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

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Encode for Netlify Forms - use the static form page
    const formData = new URLSearchParams({
      "form-name": "contact",
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    // POST to the actual static HTML form page that Netlify knows about
    const submissionUrl = `${event.headers.origin || "https://jbrannelid.com"}/forms.html`;

    console.log("Submitting to:", submissionUrl);
    console.log("Form data:", Object.fromEntries(formData));

    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("Netlify response status:", response.status);
    console.log(
      "Netlify response headers:",
      Object.fromEntries(response.headers)
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Netlify error:", errorText);
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
