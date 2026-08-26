import crypto from "crypto";
import User from "../models/user.model.js";

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, notes } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        console.log("Is Authentic:", isAuthentic);
        console.log("Notes received:", notes);

        if (isAuthentic) {
            // update user plan and credits
            const userId = notes.userId;
            const credits = Number(notes.credits);
            const plan = notes.plan;

            console.log("Updating user:", userId, "with credits:", credits, "and plan:", plan);

            const updatedUser = await User.findByIdAndUpdate(userId, {
                $inc: { credits },
                plan
            }, { new: true });

            console.log("Updated user in DB:", updatedUser);

            return res.status(200).json({ success: true, message: "Payment successful" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.log("Verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
