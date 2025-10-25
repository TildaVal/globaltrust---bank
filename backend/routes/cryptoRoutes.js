import express from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const router = express.Router();

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

// ===== Simulated Buy Crypto =====
router.post("/buy", auth, async (req, res) => {
  const { coin, amount, price } = req.body;
  const user = await User.findById(req.userId);
  const total = amount * price;

  if (total > user.balance)
    return res.status(400).json({ message: "Insufficient funds for purchase" });

  user.balance -= total;
  await user.save();

  res.json({
    message: `Bought ${amount} ${coin} successfully`,
    balance: user.balance,
  });
});

// ===== Simulated Sell Crypto =====
router.post("/sell", auth, async (req, res) => {
  const { coin, amount, price } = req.body;
  const user = await User.findById(req.userId);
  const total = amount * price;

  user.balance += total;
  await user.save();

  res.json({
    message: `Sold ${amount} ${coin} successfully`,
    balance: user.balance,
  });
});

export default router;
