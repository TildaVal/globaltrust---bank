import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
console.log(
  "Stripe key:",
  process.env.STRIPE_SECRET_KEY ? "Loaded ✅" : "Missing ❌"
);

import { connectDB } from "./config/db.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Database connection
connectDB();
// Initialize app BEFORE using it
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import investmentsRoutes from "./routes/InvestmentRoutes.js";

// Root route
app.get("/", (req, res) => {
  res.send("MetroneBank API running securely 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Metrone Bank API running smoothly 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/investments", investmentsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

