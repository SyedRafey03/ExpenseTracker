const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Link each transaction to a specific user
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    }, // 'income' or 'expense'
    category: { 
        type: String, 
        required: true 
    },
    // --- UPDATED DATE FIELD ---
    date: { 
        type: Date, 
        default: Date.now // This ensures every new transaction gets a timestamp automatically
    }
});

// Use mongoose.model to compile the schema into a model
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;