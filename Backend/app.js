const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
// const { v4: uuidv4 } = require('uuid');
const User = require('./Models/UserDetails');
const Admin = require('./Models/AdminDetails'); 
// const fetch = require('node-fetch');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const port = process.env.PORT || 3002;

// Middleware

const auth = require('./routes/authMiddleware');

// Use the secret key from the environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a token
function generateToken(user) {
    return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
}

app.get('/test-auth', auth, (req, res) => {
    res.send({ user: req.user });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'your-secret-key', // replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// MongoDB connection
dotenv.config();
const url = process.env.mongodb_uri;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
    res.redirect('/register');
});

const userRouter = require('./routes/userRoutes'); // Assuming your routes are in the routes/user.js file
app.use('/', userRouter);

app.use(cors());
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/api', postRoutes); // Use the routes defined in postRoutes.js
app.use(postRoutes);

// Use the routes defined in routes/index.js
app.use('/api', require('./routes/postRoutes'));

app.get('/champions_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/user/champions_league.html'));
});


// Serve your HTML page for Champions League
app.get('/champions_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/user/champions_league.html'));
});

// API route fetching data from football-data.org
app.get('/api/football', async (req, res) => {
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

// Serve your HTML page for Premier League
app.get('/premier_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/user/premier_league.html'));
});

// API route fetching data from football-data.org
app.get('/api/premier_league', async (req, res) => {
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


// x-rapidapi-key': 'ae9cd53d1c2f4aa4b62f942b8c1e9318

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
