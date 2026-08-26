import express from "express"

import isAuth from "../middlewares/isAuth.js"
import { billing } from "../controllers/billing.controller.js"
import { verifyPayment } from "../controllers/razorpay.controller.js"

const billingRouter=express.Router()

billingRouter.post("/",isAuth,billing)
billingRouter.post("/verify", isAuth, verifyPayment)

export default billingRouter