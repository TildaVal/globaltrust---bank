// controllers/transactionsController.js
import Transaction from "../models/Transaction.js";
export const recentTransactions = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json([]);
  const tx = await Transaction.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.json(tx);
};


