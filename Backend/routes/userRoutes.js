const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const User = require('../Models/UserDetails');
const Counter = require('../Models/Counter');
const Post = require('../Models/Post');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();

// Setup session middleware
app.use(session({
    secret: '21661a921d549a2fa6b12fad97b51c884d6df692018bb94bd466a8af0261f22b', // Replace with the generated secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'user', 'User_Register.html'));
});

router.get('/leagues', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'user', 'league.html'));
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
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'user', 'User_Login.html'));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

        req.session.userId = user.userId;
        req.session.username = user.username; // Store username in session
        res.redirect('/Home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

router.get('/Home', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findOne({ userId: req.session.userId });

        if (!user) {
            return res.redirect('/login');
        }

        let homePage = fs.readFileSync(path.join(__dirname, '..', '..', 'Frontend', 'user', 'Home.html'), 'utf8');

        homePage = homePage.replace(/\{\{username\}\}/g, user.username || '')
                           .replace(/\{\{email\}\}/g, user.email || '')
                           .replace(/\{\{phone\}\}/g, user.phone || '')
                           .replace(/\{\{fav_team1\}\}/g, user.fav_team1 || '')
                           .replace(/\{\{fav_player\}\}/g, user.fav_player || '');

        res.send(homePage);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading home page');
    }
});

router.post('/update-profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    const { username, email, phone, fav_team1, fav_player } = req.body;

    try {
        const user = await User.findOne({ userId: req.session.userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user details
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.fav_team1 = fav_team1 || user.fav_team1;
        user.fav_player = fav_player || user.fav_player;

        await user.save();

        res.redirect('/Home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile');
    }
});

router.get('/get-user-details', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ userId: req.session.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            phone: user.phone,
            fav_team1: user.fav_team1,
            fav_player: user.fav_player
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user details' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});


// const authMiddleware = async (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

//         if (!user) {
//             throw new Error();
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };





router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.get('/api/check-session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
