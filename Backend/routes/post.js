const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../Models/Post');
const User = require('../Models/UserDetails');
const verifyToken = require('../middleware/authMiddleware');
const dotenv = require('dotenv');

const router = express.Router();

dotenv.config();
// Middleware to serve static files
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/post', verifyToken, upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const { text } = req.body;
        const imageUrl = req.files['image'] ? req.files['image'][0].path : null;
        const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

        const newPost = new Post({
            userId: req.user.userId,
            text,
            imageUrl,
            videoUrl
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.get('/leagues', (req, res) => {
    const filePath = path.join(__dirname, '../../Frontend/user/league.html');
    console.log(`Serving file from: ${filePath}`);
    res.sendFile(filePath);
});

// Serve Champions League HTML page
router.get('/champions_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/user/champions_league.html'));
});

// Fetch Champions League data from football-data.org
router.get('/api/football', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const apiKey = process.env.FOOTBALL_DATA_API_KEY;
        const response = await fetch('https://api.football-data.org/v2/competitions/CL/matches', {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching football data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Serve Premier League HTML page
router.get('/premier_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/user/premier_league.html'));
});

// Fetch Premier League data from football-data.org
router.get('/api/premier_league', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const apiKey = process.env.FOOTBALL_DATA_API_KEY;
        const response = await fetch('https://api.football-data.org/v2/competitions/PL/matches', {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching Premier League data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
