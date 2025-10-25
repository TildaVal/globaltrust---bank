// controllers/paymentsController.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripeConfig = async (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "" });
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "ngn" } = req.body;
    // amount expected in smallest currency unit (kobo)
    // if frontend sends NGN (₦) value, convert to kobo:
    const amountInKobo = Math.round(parseFloat(amount) * 100);
    const intent = await stripe.paymentIntents.create({
      amount: amountInKobo,
      currency,
      // optionally attach metadata: user id
      metadata: { userId: req.userId || "guest" },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("stripe error", err);
    res
      .status(500)
      .json({ message: "Payment creation failed", error: err.message });
  }
};
