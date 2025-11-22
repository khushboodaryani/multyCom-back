import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import enquiriesRouter from "./routes/enquiries.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://multy-com.vercel.app", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/enquiries", enquiriesRouter);

app.get("/", (req, res) => res.send("MultyComm backend is Healthy!"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
