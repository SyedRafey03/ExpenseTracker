const router = require('express').Router();
let Transaction = require('../models/Transaction');

// 1. GET transactions ONLY for a specific user
router.get('/:userId', (req, res) => {
    Transaction.find({ user: req.params.userId })
        .then(transactions => res.json(transactions))
        .catch(err => res.status(400).json('Error: ' + err));
});

// 2. ADD a transaction linked to a user
router.post('/add', (req, res) => {
    const { description, amount, type, category, userId } = req.body;

    const newTransaction = new Transaction({
        description,
        amount,
        type,
        category,
        user: userId // Link it to the user
    });

    newTransaction.save()
        .then(() => res.json('Transaction added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// 3. DELETE remains similar (but should ideally check ownership)
router.delete('/:id', (req, res) => {
    Transaction.findByIdAndDelete(req.params.id)
        .then(() => res.json('Transaction deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;