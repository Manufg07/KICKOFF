const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../Models/Post');
const auth = require('./authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
// const upload = multer({ storage });

// Create a new post
// router.post('/api/posts', auth, upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
//     try {
//         const { text } = req.body;
//         const image = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
//         const video = req.files.video ? `/uploads/${req.files.video[0].filename}` : null;

//         const post = new Post({
//             user: req.user._id,
//             text,
//             imageUrl: image,
//             videoUrl: video
//         });

//         await post.save();
//         res.status(201).json(post);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// POST a new post
router.post('/api/posts', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    try {
        const { text } = req.body;
        let imageUrl, videoUrl;

        if (req.files.image) {
            imageUrl = req.files.image[0].path; // You might want to store this in a CDN in production
        }
        if (req.files.video) {
            videoUrl = req.files.video[0].path; // You might want to store this in a CDN in production
        }

        const newPost = new Post({
            text,
            imageUrl,
            videoUrl,
            author: req.user.id // This assumes the auth middleware adds the user to the request
        });

        await newPost.save();

        // Populate author details before sending the response
        await newPost.populate('author', 'username avatar').execPopulate();

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET posts with pagination
router.get('/api/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username email fav_team1 fav_player');

        const total = await Post.countDocuments();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
