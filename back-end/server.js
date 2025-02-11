const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587, // Port for TLS
  auth: {
    user: "postmaster@sandbox8a39441d607f4a24b3b7d28b9625b802.mailgun.org", // Mailgun SMTP login
    pass: "ff616b672a36c35fce57349fb5aefaa3-e61ae8dd-018288a3", // Mailgun SMTP password (needs to hit dopler for better security)
  },
  secure: false, // Start TLS (do not use SSL, this is bad)
});

// API endpoint to handle form submission
app.post("/send-email", (req, res) => {
  console.log("Received request to send email:", req.body);
  const { company, name, email, message } = req.body;

  // Email content
  const mailOptions = {
    from: "postmaster@sandbox8a39441d607f4a24b3b7d28b9625b802.mailgun.org", // Mailgun sender email address
    to: "awbrokerstarter@gmail.com", // Company email addresses to send to (Chuck, Ry, maybe me, maybe all?)
    subject: `New Contact Form Submission from ${name}`,
    text: `
      You have received a new message from the contact form:

      Company: ${company}
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  };

  // Send Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.status(200).json({ success: "Email sent successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
