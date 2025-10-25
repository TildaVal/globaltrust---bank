import Wallet from "../models/Wallet.js";

// 🟩 Create a new wallet
export const createWallet = async (req, res) => {
  try {
    const wallet = await Wallet.create({ userId: req.userId, balance: 0 });
    res.status(201).json({ message: "Wallet created successfully", wallet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating wallet", error: error.message });
  }
};

// 🟩 Get wallet info
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId: req.userId } });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wallet", error: error.message });
  }
};

// 🟩 Transfer funds
export const transferFunds = async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;

    const sender = await Wallet.findOne({ where: { userId: req.userId } });
    const recipient = await Wallet.findOne({
      where: { email: recipientEmail },
    });

    if (!recipient)
      return res.status(404).json({ message: "Recipient not found" });
    if (amount <= 0 || amount > sender.balance)
      return res.status(400).json({ message: "Invalid or insufficient funds" });

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
};
