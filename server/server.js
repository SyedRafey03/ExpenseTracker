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

// 2. MongoDB Connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB database connection established successfully"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

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