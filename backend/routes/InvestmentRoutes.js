import express from "express";
import {
  applyInvestment,
  myApplications,
} from "../controllers/InvestmentController.js";
import { auth } from "../middleware/auth.js"; // your JWT auth middleware

const router = express.Router();

router.post("/apply", applyInvestment); // or auth if only logged users can apply
router.get("/my-applications", auth, myApplications);

export default router;
