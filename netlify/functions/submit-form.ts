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

    // Encode for Netlify Forms
    const formData = new URLSearchParams({
      "form-name": "contact",
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    // Submit to Netlify Forms
    const response = await fetch("https://jbrannelid.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
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
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
