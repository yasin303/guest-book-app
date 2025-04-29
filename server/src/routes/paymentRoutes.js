import express from "express";
import { createPayment, getPayment, getPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/", createPayment);

router.get("/", protect, getPayments);

router.get("/:id", getPayment);

export default router;