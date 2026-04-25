// POST /subscribe - Add email subscriber

const { success, error, parseBody, isValidEmail } = require("./utils");
const { addSubscriber, getSubscriber } = require("./db");

// Optional: MailerLite integration
const MAILERLITE_ENABLED = process.env.MAILERLITE_API_KEY ? true : false;

exports.handler = async (event) => {
  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return success({});
    }
    
    const body = parseBody(event);
    const { email, source } = body;
    
    // Validate email
    if (!email) {
      return error("Email required", 400);
    }
    
    if (!isValidEmail(email)) {
      return error("Invalid email format", 400);
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if already subscribed
    const existing = await getSubscriber(normalizedEmail);
    
    if (existing) {
      // Don't reveal if email exists for privacy
      // Just return success
      return success({
        message: "Thanks for subscribing!",
        subscribed: true
      });
    }
    
    // Add to DynamoDB
    await addSubscriber(normalizedEmail, source || "website");
    
    // Optionally add to MailerLite
    if (MAILERLITE_ENABLED) {
      try {
        await addToMailerLite(normalizedEmail);
      } catch (mlError) {
        // Don't fail the request if MailerLite fails
        console.error("MailerLite error:", mlError.message);
      }
    }
    
    return success({
      message: "Thanks for subscribing!",
      subscribed: true
    });
    
  } catch (err) {
    console.error("Subscribe error:", err);
    return error("Failed to subscribe", 500);
  }
};

/**
 * Add subscriber to MailerLite
 */
async function addToMailerLite(email) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  
  if (!apiKey) {
    console.log("MailerLite API key not configured");
    return;
  }
  
  const url = groupId 
    ? `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`
    : "https://api.mailerlite.com/api/v2/subscribers";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MailerLite-ApiKey": apiKey
    },
    body: JSON.stringify({
      email,
      resubscribe: true
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "MailerLite API error");
  }
  
  console.log("Added to MailerLite:", email);
}
