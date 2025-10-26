import express from "express";
import {
  createPaymentIntent,
  getStripeConfig,
} from "../controllers/paymentsController.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/stripe-config", getStripeConfig);
//router.post("/create-payment-intent", auth, createPaymentIntent);
router.post("/create-payment-intent", createPaymentIntent);

router.post("/create", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;