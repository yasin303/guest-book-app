import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { initializeDatabase } from "./models/db.js";
import guestRoutes from "./routes/guestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5001;

initializeDatabase()
  .then(() => {
    app.use(
      cors({
        origin: ["https://guest-book-app-navy.vercel.app", "http://localhost:3000"],
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // API Routes
    app.use("/api/guests", guestRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/payments", paymentRoutes);

    app.get("/", (req, res) => {
      res.send("Welcome to the Guest Book API!");
    });

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
