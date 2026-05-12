const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Express route for creating Razorpay order
app.post("/createOrder", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Export as Firebase function (2nd Gen)
exports.api = functions.https.onRequest(app);
