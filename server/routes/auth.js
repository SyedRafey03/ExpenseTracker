const router = require('express').Router();
const User = require('../models/User');

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ error: "Email or Username already exists", details: err.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email and password
        const user = await User.findOne({ email, password });

        if (user) {
            // Returning the _id along with other user details
            res.json({ 
                message: "Login successful", 
                user: { 
                    _id: user._id, 
                    username: user.username, 
                    email: user.email,
                    monthlyBudget: user.monthlyBudget
                } 
            });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// UPDATE BUDGET ROUTE
router.put('/budget/:id', async (req, res) => {
    try {
        const { monthlyBudget } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { monthlyBudget }, 
            { new: true }
        );
        res.json({ message: "Budget updated successfully", monthlyBudget: updatedUser.monthlyBudget });
    } catch (err) {
        console.error("Budget update error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;