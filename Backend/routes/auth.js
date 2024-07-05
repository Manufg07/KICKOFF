const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserDetails');
const Counter = require('../Models/Counter');
const path = require('path');
const router = express.Router();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'user', 'User_Register.html'));
});

router.post('/register', async (req, res) => {
    const { username, email, phone, password, confirm_password, terms } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    if (!terms) {
        return res.status(400).send('You must agree to the terms and conditions');
    }

    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const counter = await Counter.findOneAndUpdate(
            { name: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const userId = `kickoff_User_${counter.seq}`;

        const newUser = new User({
            userId,
            username,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'user', 'User_Login.html'));
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed - User doesn't exist" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed - Password doesn't match" });
        }

        const token = jwt.sign(
            { userId: user._id },
            "your-secret-key",
            { expiresIn: "1h" }
        );

        res.cookie("AuthToken", token, { httpOnly: true });
        res.redirect('/user/Home');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
