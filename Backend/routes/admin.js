const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const Admin = require('../Models/AdminDetails'); // Ensure you have this model
const Post = require('../Models/Post');
const User = require('../Models/UserDetails');
const verifyAdminToken = require('../middleware/verifyAdminToken'); // New middleware for admin authentication
const router = express.Router();

// Admin registration
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'adminRegister.html'));
});

router.post('/register', async (req, res) => {
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
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering admin');
    }
});

// Route to serve admin login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'adminLogin.html'));
});

// Route to handle admin login POST request
router.post('/login', async (req, res) => {
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

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id },
            "your-secret-key",
            { expiresIn: "1h" }
        );

        // Set cookie and redirect to admin home
        res.cookie("AuthToken", token, { httpOnly: true });
        res.redirect('/admin/home'); // Ensure this path matches your admin home route
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Protected admin home route
router.get('/home', verifyAdminToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'home.html'));
});

// Get total users (protected route)
router.get('/totalUsers', verifyAdminToken, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        res.json({ totalUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching total users');
    }
});

// Get all users (protected route)
router.get('/users', verifyAdminToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

// View users page (protected route)
router.get('/viewusers', verifyAdminToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'viewUser.html'));
});

router.get('/viewpost', verifyAdminToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'admin', 'viewPost.html'));
});


// Delete user by userId (protected route)
router.delete('/users/:userId', verifyAdminToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOneAndDelete({ userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

// Get user details by userId (protected route)
// Get user details by userId (protected route)
router.get('/users/:userId', verifyAdminToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postCount = await Post.countDocuments({ userId: user._id });

        res.json({ user, postCount });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all posts (protected route)
router.get('/admin/posts', verifyAdminToken, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get post details by ID (protected route)
router.get('/admin/posts/:postId', verifyAdminToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a post by ID (protected route)
router.delete('/admin/posts/:postId', verifyAdminToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
