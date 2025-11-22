import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn("SMTP not fully configured. Emails will fail if attempted.");
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for others
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * sendNotificationEmail(payload)
 * payload: { to, subject, text, html? }
 */
export async function sendNotificationEmail({ to, subject, text, html }) {
  if (!to) throw new Error("No recipient (to) provided");
  const mailOptions = {
    from: `"Khushboo Daryani" <${FROM_EMAIL}>`,
    to,
    subject,
    text,
    html
  };
  return transporter.sendMail(mailOptions);
}
