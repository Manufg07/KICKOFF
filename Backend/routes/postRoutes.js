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
const upload = multer({ storage });

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

router.post('/api/posts', auth, upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { text } = req.body;
        const image = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
        const video = req.files.video ? `/uploads/${req.files.video[0].filename}` : null;

        const post = new Post({
            user: req.user._id,
            text,
            imageUrl: image,
            videoUrl: video
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(400).json({ error: error.message });
    }
});


// Fetch posts with pagination
router.get('/api/posts', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({ posts, totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
