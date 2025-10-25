import express from "express";
import {
  createPaymentIntent,
  getStripeConfig,
} from "../controllers/paymentsController.js";

import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/stripe-config", getStripeConfig);
router.post("/create-payment-intent", auth, createPaymentIntent);
export default router;
