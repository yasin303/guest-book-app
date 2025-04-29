import express from "express";
import { createGuest, getGuests } from "../controllers/guestController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();
router.post("/", createGuest);
router.get("/", protect, getGuests);

export default router;
