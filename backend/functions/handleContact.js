// POST /contact - Forwards a contact form submission to the office.
// Sends an email to CONTACT_EMAIL (if set) and an SMS to SMS_NUMBER (if set).
// Both channels are best-effort: a failure in one is logged but doesn't fail the request.
//
// Validation: requires `name` + `message` + at least one of (`email`, `phone`).
// Any additional fields submitted (subject, address, service, etc.) are passed
// through to the email body and SMS body verbatim. Per-merchant frontends can
// shape the form however they want — the backend stays generic.

const { success, error, parseBody, isValidEmail, normalizePhone, getClientIp } = require("./utils");
const { sendEmail } = require("./emailService");
const { checkAndRecord } = require("./rateLimit");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const SMS_NUMBER = process.env.SMS_NUMBER;
const SITE_NAME = process.env.SITE_NAME || "Website";
const DAILY_LIMIT = 5;

const sns = new SNSClient({});

const KNOWN_FIELDS = ["name", "email", "phone", "subject", "address", "service", "message"];

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
      return success({});
    }

    const body = parseBody(event);
    const name = (body.name || "").trim();
    const phoneRaw = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();

    if (!name || !message) {
      return error("Name and message are required.", 400);
    }
    if (!email && !phoneRaw) {
      return error("Provide an email address or phone number so we can reply.", 400);
    }

    let phone = null;
    if (phoneRaw) {
      phone = normalizePhone(phoneRaw);
      if (!phone) return error("Please provide a valid US phone number.", 400);
    }
    if (email && !isValidEmail(email)) {
      return error("That email address doesn't look right.", 400);
    }

    const ip = getClientIp(event);
    const keys = [`ip:${ip}`];
    if (phone) keys.push(`phone:${phone}`);
    if (email) keys.push(`email:${email.toLowerCase()}`);

    const { allowed } = await checkAndRecord(keys, DAILY_LIMIT);
    if (!allowed) {
      console.warn("Rate limit exceeded", { ip, phone, email });
      return error("You've reached today's submission limit. Please try again tomorrow.", 429);
    }

    const extras = {};
    for (const [k, v] of Object.entries(body)) {
      if (KNOWN_FIELDS.includes(k)) continue;
      const s = String(v ?? "").trim();
      if (s) extras[k] = s;
    }

    const subject = body.subject ? String(body.subject).trim() : `New ${SITE_NAME} message`;
    const fields = collectFields(body, extras);

    const tasks = [];
    if (CONTACT_EMAIL) {
      tasks.push(
        sendEmail(
          CONTACT_EMAIL,
          `[${SITE_NAME}] ${subject}`,
          buildEmailHtml({ name, fields, message }),
          buildEmailText({ name, fields, message })
        ).catch((err) => console.error("Email send failed:", err))
      );
    }
    if (SMS_NUMBER) {
      tasks.push(
        sns.send(new PublishCommand({
          PhoneNumber: SMS_NUMBER,
          Message: buildSmsBody({ name, fields, message }),
          MessageAttributes: {
            "AWS.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" },
          },
        })).catch((err) => console.error("SMS send failed:", err))
      );
    }
    if (!tasks.length) {
      console.warn("Contact form submitted but neither CONTACT_EMAIL nor SMS_NUMBER is configured");
    }
    await Promise.all(tasks);

    console.log(`Contact form from ${name} (${email || phone || "no contact"})`);
    return success({ message: "Thanks! We'll be in touch shortly." });
  } catch (err) {
    console.error("Error handling contact form:", err);
    return error("Failed to send message", 500);
  }
};

function collectFields(body, extras) {
  const out = [];
  if (body.phone) out.push(["Phone", String(body.phone).trim()]);
  if (body.email) out.push(["Email", String(body.email).trim()]);
  if (body.address) out.push(["Address", String(body.address).trim()]);
  if (body.service) out.push(["Service", String(body.service).trim()]);
  for (const [k, v] of Object.entries(extras)) {
    out.push([titleCase(k), v]);
  }
  return out;
}

function titleCase(s) {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).replace(/_/g, " ");
}

function buildEmailHtml({ name, fields, message }) {
  const rows = fields.map(([k, v]) =>
    `<div style="margin-bottom:10px"><span style="font-weight:bold;color:#444">${escapeHtml(k)}:</span> ${escapeHtml(v)}</div>`
  ).join("");
  return `
<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; line-height: 1.6; color: #222; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .header h1 { color: white; margin: 0; font-size: 22px; }
  .content { background: #fafafa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #eee; }
  .msg-box { background: white; border-radius: 4px; padding: 15px; border: 1px solid #e5e5e5; margin-top: 15px; }
</style></head>
<body><div class="container">
  <div class="header"><h1>New contact form message</h1></div>
  <div class="content">
    <div style="margin-bottom:10px"><span style="font-weight:bold;color:#444">From:</span> ${escapeHtml(name)}</div>
    ${rows}
    <div class="msg-box"><span style="font-weight:bold">Message:</span><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p></div>
  </div>
</div></body></html>`.trim();
}

function buildEmailText({ name, fields, message }) {
  return [
    "New contact form message",
    "",
    `From: ${name}`,
    ...fields.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    message,
  ].join("\n");
}

function buildSmsBody({ name, fields, message }) {
  const headline = `New ${SITE_NAME} message:`;
  const top = fields.slice(0, 3).map(([k, v]) => `${k}: ${v}`);
  const body = message.length > 160 ? message.slice(0, 157) + "…" : message;
  return [headline, name, ...top, body].filter(Boolean).join("\n");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
