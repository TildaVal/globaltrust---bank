import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import investmentsRoutes from "./routes/InvestmentRoutes.js";

// Load env vars
dotenv.config();

// Initialize app BEFORE using it
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/investments", investmentsRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("MetroneBank API running securely 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Metrone Bank API running smoothly 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
