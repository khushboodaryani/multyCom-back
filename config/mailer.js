import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];

apiKey.apiKey = process.env.BREVO_API_KEY;

const FROM_EMAIL = process.env.FROM_EMAIL || "khushboodaryani1@gmail.com";
const FROM_NAME = "Khushboo Daryani"; 

export async function sendNotificationEmail({ to, subject, text, html }) {
  if (!to) throw new Error("No recipient (to) provided");

  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = { "name": FROM_NAME, "email": FROM_EMAIL };
  sendSmtpEmail.to = [{ "email": to }];

  sendSmtpEmail.htmlContent = html || `<html><body><pre>${text}</pre></body></html>`;
  
  if (text) {
      sendSmtpEmail.textContent = text;
  }

  try {
    console.log(`Attempting to send email to ${to} via Brevo API...`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully. Message ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error sending email via Brevo API:', error);
    if (error.body) {
        console.error('Brevo Error Body:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}