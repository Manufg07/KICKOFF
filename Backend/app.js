const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
// const { v4: uuidv4 } = require('uuid');
const User = require('./Models/UserDetails');
const Admin = require('./Models/AdminDetails'); 
const fetch = require('node-fetch');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
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

app.get('/champions_league', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/user/champions_league.html'));
});

// Example API route fetching data
app.get('/api/football', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v2/competitions/CL/matches', {
            headers: { 'X-Auth-Token': 'ae9cd53d1c2f4aa4b62f942b8c1e9318' }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching football data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
