import express from "express";
import Enquiry from "../models/Enquiry.js";
import { sendNotificationEmail } from "../config/mailer.js";

const router = express.Router();

const dispositionEmailMap = {
  "Customer Support": "ayan@multycomm.com",
  "Consultant Support": "akash@multycomm.com",
  "B2B Lead": "deepak@multycomm.com",
  "New Lead": "aveek@multycomm.com",
  "General Enquiry": null,
  "Testing Request": "khushboodaryani1@gmail.com"
};

function validatePayload(payload) {
  const errors = [];
  if (!payload.name || typeof payload.name !== "string") errors.push("name is required");
  if (!payload.email || typeof payload.email !== "string") errors.push("email is required");
  if (!payload.query || typeof payload.query !== "string") errors.push("query is required");
  if (!payload.disposition || !Object.keys(dispositionEmailMap).includes(payload.disposition)) errors.push("disposition is invalid");
  if (payload.age && isNaN(Number(payload.age))) errors.push("age must be a number");
  return errors;
}

router.post("/", async (req, res) => {
  try {
    const payload = {
      name: (req.body.name || "").trim(),
      company: req.body.company || "",
      gender: req.body.gender || "",
      age: req.body.age ? Number(req.body.age) : undefined,
      email: (req.body.email || "").trim(),
      contactNumber: (req.body.contactNumber || "").trim(),
      query: (req.body.query || "").trim(),
      disposition: req.body.disposition
    };

    const errors = validatePayload(payload);
    if (errors.length) return res.status(400).json({ ok: false, errors });

    const doc = new Enquiry(payload);
    await doc.save();

    const recipient = dispositionEmailMap[payload.disposition];
    if (recipient) {
      const subject = "New Client Enquiry from MultyComm Form";
      const text = [
        "Greetings!",
        "",
        "We have received an inquiry for the client detailed below. Please provide them with the necessary assistance.",
        "",
        `Client/Caller Name: ${payload.name}`,
        `Company: ${payload.company || "-"}`,
        `Gender: ${payload.gender || "-"}`,
        `Age: ${payload.age ?? "-"}`,
        `Email: ${payload.email}`,
        `Query: ${payload.query}`,
        "",
        "Thank You!"
      ].join("\n");

      try {
        await sendNotificationEmail({ to: recipient, subject, text });
        return res.status(201).json({ ok: true, message: "Saved and email sent", id: doc._id });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        return res.status(201).json({ ok: true, message: "Saved but email send failed", emailError: String(emailErr), id: doc._id });
      }
    } else {
      return res.status(201).json({ ok: true, message: "Saved (General Enquiry, no email sent!)", id: doc._id });
    }
  } catch (err) {
    console.error("Enquiry route error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
