const express = require('express');
const path = require('path');
const User = require('../Models/UserDetails');
const verifyToken = require('../middleware/authMiddleware');
const fs = require('fs');

const router = express.Router();


router.get('/Home', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.redirect('/auth/login');
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

router.get('/get-user-details', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
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

router.post('/update-profile', verifyToken, async (req, res) => {
    const { username, email, phone, fav_team1, fav_player } = req.body;

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.fav_team1 = fav_team1 || user.fav_team1;
        user.fav_player = fav_player || user.fav_player;

        await user.save();

        res.redirect('/user/Home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile');
    }
});

router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

// Get connected friends
router.get('/connected-friends', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends');
        res.json(user.friends);
    } catch (error) {
        console.error('Error fetching connected friends:', error);
        res.status(500).json({ error: 'Failed to fetch connected friends' });
    }
});

// Get friend suggestions
router.get('/friend-suggestions', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friends = user.friends.map(friend => friend.toString());
        friends.push(req.user._id.toString());

        const suggestions = await User.find({ _id: { $nin: friends } }).limit(10);
        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching friend suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch friend suggestions' });
    }
});

module.exports = router;
