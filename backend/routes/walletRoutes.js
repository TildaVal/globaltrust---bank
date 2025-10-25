import express from "express";
import jwt from "jsonwebtoken";
import {
  createWallet,
  getWallet,
  transferFunds,
} from "../controllers/walletController.js";
import UserModel from "../models/user.js";

const router = express.Router();

// ===== Middleware for authentication =====
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ===== Get Wallet Balance =====
router.get("/balance", auth, async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.userId); // ✅ Sequelize method
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== Deposit =====
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0)
      return res.status(400).json({ message: "Invalid deposit amount" });

    const user = await UserModel.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += parseFloat(amount);
    await user.save();

    res.json({ message: "Deposit successful", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== Withdraw =====
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await UserModel.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (amount <= 0 || amount > user.balance)
      return res.status(400).json({ message: "Invalid or insufficient funds" });

    user.balance -= parseFloat(amount);
    await user.save();

    res.json({ message: "Withdrawal successful", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== Transfer =====
router.post("/transfer", auth, transferFunds); // ✅ now references a real exported function

// ===== Wallet CRUD =====
router.post("/create", createWallet);
router.get("/:id", getWallet);

export default router;
