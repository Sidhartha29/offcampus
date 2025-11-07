const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends a simple HTML email.
 */
async function sendMail(to, subject, html) {
  const info = await transporter.sendMail({
    from: `"ByteXL Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
  console.log('✉️  Email sent', info.messageId);
}

module.exports = { sendMail };
//helllo