import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: false },
  gender: { type: String, required: false },
  age: { type: Number, required: false },
  email: { type: String, required: true },
  contactNumber: { type: String, required: false },
  query: { type: String, required: true },
  disposition: { type: String, required: true, enum: [
    "Customer Support",
    "Consultant Support",
    "B2B Lead",
    "New Lead",
    "General Enquiry",
    "Testing Request"
    
  ]},
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
export default Enquiry;
