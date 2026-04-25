// Email service using AWS SES

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-2",
});

const FROM_EMAIL = process.env.FROM_EMAIL;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const SITE_NAME = process.env.SITE_NAME || "My Store";
const SITE_URL = process.env.SITE_URL || "";

if (!FROM_EMAIL) {
  console.error("Missing required FROM_EMAIL environment variable");
}

/**
 * Send an email via SES
 */
const sendEmail = async (to, subject, htmlBody, textBody) => {
  const params = {
    Source: `${SITE_NAME} <${FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
  };

  await sesClient.send(new SendEmailCommand(params));
  console.log(`Email sent to ${to}: ${subject}`);
};

/**
 * Order confirmation - sent immediately after payment
 */
const sendOrderConfirmation = async (order) => {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.name} (${item.size || ""} ${item.color || ""}) x${
          item.quantity
        }`
    )
    .join("\n");

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} (${item.size || ""} ${item.color || ""}) x${
          item.quantity
        }</li>`
    )
    .join("");

  const subject = `Order Confirmed! #${order.id.slice(-8).toUpperCase()}`;

  const textBody = `
Hey ${order.customerName || "there"}!

Thanks for your order!

ORDER DETAILS:
${itemsList}

SHIPPING TO:
${order.shippingName}
${order.shippingAddress?.line1}
${order.shippingAddress?.line2 || ""}
${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${
    order.shippingAddress?.postal_code
  }

Your order is being processed. We'll email you again when your order ships!
${order.hasSubscription ? `
SUBSCRIPTION INFO:
Your first year of hotline service is included free.
Renewal: $44.95/year starting ${new Date(order.subscriptionRenewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
` : ""}
Thanks,
${SITE_NAME}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #333; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { background: #fafafa; padding: 30px; border-radius: 0 0 12px 12px; }
    .order-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hey ${order.customerName || "there"}!</p>
      <p>Thanks for your order!</p>

      <div class="order-box">
        <h3 style="margin-top: 0;">Order #${order.id
          .slice(-8)
          .toUpperCase()}</h3>
        <ul>${itemsHtml}</ul>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 15px 0;">
        <strong>Shipping to:</strong><br>
        ${order.shippingName}<br>
        ${order.shippingAddress?.line1}<br>
        ${
          order.shippingAddress?.line2
            ? order.shippingAddress.line2 + "<br>"
            : ""
        }
        ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${
    order.shippingAddress?.postal_code
  }
      </div>

      <p>Your order is being processed. We'll email you again when your order ships!</p>
      ${order.hasSubscription ? `
      <div class="order-box" style="border-color: #0075C9;">
        <h3 style="margin-top: 0; color: #0075C9;">Subscription Included</h3>
        <p>Your first year of hotline service is included free with your phone.</p>
        <p style="margin-bottom: 0;"><strong>Renewal:</strong> $44.95/year starting ${new Date(order.subscriptionRenewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.</p>
      </div>
      ` : ""}

      <p>Thanks,<br>
      <strong>${SITE_NAME}</strong></p>
    </div>
    <div class="footer">
      ${SITE_URL ? `<p><a href="${SITE_URL}">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>` : ""}
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail(order.customerEmail, subject, htmlBody, textBody);
};

/**
 * Order in production - sent when fulfillment begins
 */
const sendOrderInProduction = async (order) => {
  const subject = `Your order is being made! #${order.id
    .slice(-8)
    .toUpperCase()}`;

  const textBody = `
Hey ${order.customerName || "there"}!

Great news — your order is officially in production!

Once everything is made and quality-checked, it'll ship out and you'll get tracking info.

Thanks for your patience!

${SITE_NAME}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #333; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { background: #fafafa; padding: 30px; border-radius: 0 0 12px 12px; }
    .status-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #333; text-align: center; }
    .status-box h2 { color: #333; margin: 0 0 10px 0; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Order is Being Made!</h1>
    </div>
    <div class="content">
      <p>Hey ${order.customerName || "there"}!</p>

      <div class="status-box">
        <h2>In Production</h2>
        <p style="margin: 0;">Order #${order.id.slice(-8).toUpperCase()}</p>
      </div>

      <p>Great news — your order is officially in production!</p>

      <p>Once everything is made and quality-checked, it'll ship out and you'll get tracking info.</p>

      <p>Thanks for your patience!</p>

      <p><strong>${SITE_NAME}</strong></p>
    </div>
    <div class="footer">
      ${SITE_URL ? `<p><a href="${SITE_URL}">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>` : ""}
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail(order.customerEmail, subject, htmlBody, textBody);
};

/**
 * Order shipped - sent when fulfillment provider ships
 */
const sendOrderShipped = async (
  order,
  trackingNumber,
  trackingUrl,
  carrier
) => {
  const subject = `Your order shipped! #${order.id.slice(-8).toUpperCase()}`;

  const textBody = `
Hey ${order.customerName || "there"}!

Your order is on its way!

TRACKING INFO:
Carrier: ${carrier || "Standard"}
Tracking Number: ${trackingNumber}
Track your package: ${trackingUrl}

Thanks,
${SITE_NAME}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #333; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { background: #fafafa; padding: 30px; border-radius: 0 0 12px 12px; }
    .tracking-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #16a34a; }
    .tracking-box h3 { color: #16a34a; margin: 0 0 15px 0; }
    .btn { display: inline-block; background: #333; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Order Shipped!</h1>
    </div>
    <div class="content">
      <p>Hey ${order.customerName || "there"}!</p>

      <p>Your order is on its way!</p>

      <div class="tracking-box">
        <h3>Tracking Info</h3>
        <p><strong>Carrier:</strong> ${carrier || "Standard"}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p style="margin-bottom: 0;">
          <a href="${trackingUrl}" class="btn">Track Your Package</a>
        </p>
      </div>

      <p>Thanks,<br>
      <strong>${SITE_NAME}</strong></p>
    </div>
    <div class="footer">
      ${SITE_URL ? `<p><a href="${SITE_URL}">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>` : ""}
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail(order.customerEmail, subject, htmlBody, textBody);
};

const sendNewOrderNotification = async (order) => {
  if (!CONTACT_EMAIL) return;

  const itemsList = order.items
    .map((item) => `• ${item.name || item.n} x${item.quantity || item.q} — $${item.price || item.p}`)
    .join("\n");

  const subject = `New Order! #${order.id.slice(-8).toUpperCase()}`;

  const textBody = `
New order received!

CUSTOMER:
${order.customerName} (${order.customerEmail})
${order.customerPhone || "No phone"}

ITEMS:
${itemsList}

SHIPPING TO:
${order.shippingName}
${order.shippingAddress?.line1}
${order.shippingAddress?.line2 || ""}
${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postal_code}

TOTAL: $${(order.amountTotal / 100).toFixed(2)}
${order.hasSubscription ? `\nSUBSCRIPTION: Renewal due ${new Date(order.subscriptionRenewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} — $44.95/yr` : ""}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { background: #fafafa; padding: 30px; border-radius: 0 0 12px 12px; }
    .order-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order!</h1>
    </div>
    <div class="content">
      <div class="order-box">
        <h3 style="margin-top: 0;">Order #${order.id.slice(-8).toUpperCase()}</h3>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
        <p><strong>Phone:</strong> ${order.customerPhone || "Not provided"}</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 15px 0;">
        <strong>Items:</strong>
        <ul>${order.items.map((item) => `<li>${item.name || item.n} x${item.quantity || item.q} — $${item.price || item.p}</li>`).join("")}</ul>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 15px 0;">
        <strong>Shipping to:</strong><br>
        ${order.shippingName}<br>
        ${order.shippingAddress?.line1}<br>
        ${order.shippingAddress?.line2 ? order.shippingAddress.line2 + "<br>" : ""}
        ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postal_code}
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 15px 0;">
        <p style="font-size: 18px; margin-bottom: 0;"><strong>Total: $${(order.amountTotal / 100).toFixed(2)}</strong></p>
      </div>
      ${order.hasSubscription ? `
      <div class="order-box" style="border-color: #0075C9;">
        <p style="margin: 0;"><strong>Subscription renewal:</strong> ${new Date(order.subscriptionRenewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} — $44.95/yr</p>
      </div>
      ` : ""}
    </div>
  </div>
</body>
</html>
  `.trim();

  await sendEmail(CONTACT_EMAIL, subject, htmlBody, textBody);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendNewOrderNotification,
  sendOrderInProduction,
  sendOrderShipped,
};
