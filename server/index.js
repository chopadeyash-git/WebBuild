import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";

import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";

dotenv.config();

const app = express();

/* ================================
   STRIPE WEBHOOK (MUST BE FIRST)
================================ */
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/* ================================
   CORS CONFIG (VERY IMPORTANT)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://webbuild-1-xheg.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ================================
   GLOBAL MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

/* ================================
   HEALTH CHECK (RENDER)
================================ */
app.get("/", (req, res) => {
  res.send("WebBuild Backend is running 🚀");
});

/* ================================
   START SERVER
================================ */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
  connectDb();
});
