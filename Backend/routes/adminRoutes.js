const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const Admin = require('../Models/AdminDetails'); // Make sure you have an AdminDetails model
const User = require('../Models/UserDetails');


const router = express.Router();

router.get('/admin/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'adminRegister.html'));
});

router.post('/admin/register', async (req, res) => {
    const { username, email, password, confirm_password, terms } = req.body;

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
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).send('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.redirect('/admin/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering admin');
    }
});

router.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'adminLogin.html'));
});

router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).send('Admin not found');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

        res.redirect('/admin/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

router.get('/admin/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'home.html'));
});

router.get('/admin/totalUsers', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        res.json({ totalUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching total users');
    }
});

router.get('/users', async (req, res) => {  // Ensure this route is correct
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

router.get('/viewusers', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'viewUser.html'));
});

module.exports = router;
