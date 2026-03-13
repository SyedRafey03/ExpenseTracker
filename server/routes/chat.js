const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { message, transactions, budgetLimit } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ reply: "Gemini API Key is missing. Please configure it in the .env file." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using a standard modern model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Calculate summary
        let totalIncome = 0;
        let totalExpenses = 0;

        let txContextText = "No transactions found.";
        if (transactions && transactions.length > 0) {
            transactions.forEach(t => {
                if (t.type === 'income') totalIncome += Number(t.amount);
                if (t.type === 'expense') totalExpenses += Number(t.amount);
            });
            txContextText = JSON.stringify(transactions.slice(-50), ['description', 'amount', 'type', 'category', 'date'], 2);
        }
        const currentBalance = totalIncome - totalExpenses;

        const systemPrompt = `You are a helpful, intelligent Financial AI Assistant embedded in an Expense Tracker app.
The user is asking you a question about their finances.

Here is the user's current financial context:
- Monthly Budget Limit: Rs. ${budgetLimit || 0}
- Total Recorded Income: Rs. ${totalIncome}
- Total Recorded Expenses: Rs. ${totalExpenses}
- Account Balance: Rs. ${currentBalance}

Here are their recent transactions:
${txContextText}

Answer the user's question accurately based on this data. Be concise, polite, and directly answer their question. Keep it short (1-3 paragraphs) and easy to read.
IMPORTANT: Format all currency amounts using the Indian Number System (e.g., 1,00,000 instead of 100,000).

User Question: "${message}"`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (err) {
        console.error("Chat generation error:", err);
        res.status(500).json({ reply: "I'm sorry, I encountered an error: " + err.message });
    }
});

module.exports = router;
