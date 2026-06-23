const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
// Allows the server to read JSON data from requests
app.use(express.json());

// Allows React frontend (port 3000 / 5173) to communicate with this backend
app.use(cors());

// 2. MongoDB Connection Middleware
const connectDB = async (req, res, next) => {
  // If already connected, continue
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      return res.status(500).json({ error: "Server Configuration Error", details: "MONGO_URI environment variable is missing." });
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB database connection established successfully");
    next();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
};

app.use(connectDB);

// Check if Gemini API key is loaded
if (process.env.GEMINI_API_KEY) {
  console.log("✅ Gemini API Key loaded successfully");
} else {
  console.log("❌ Gemini API Key is missing");
}

// 3. Link Routes
const transactionsRouter = require('./routes/transactions');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');

// Routes
app.use('/transactions', transactionsRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);

// 4. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});

// Basic test route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

module.exports = app;