// controllers/investmentsController.js
import Investment from "../models/Investment.js";
import User from "../models/user.js";

export const applyInvestment = async (req, res) => {
  try {
    const { name, email, plan, amount, note } = req.body;
    // optional: if auth middleware sets req.userId, associate user
    const userId = req.userId || null;
    const inv = await Investment.create({
      userId,
      name,
      email,
      plan,
      amount,
      note,
    });
    return res
      .status(201)
      .json({ message: "Application received", id: inv.id });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to create application", error: err.message });
  }
};

export const myApplications = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json([]);
    const apps = await Investment.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json([]);
  }
};
