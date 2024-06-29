const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./Models/UserDetails');
const Admin = require('./Models/AdminDetails'); 

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

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

app.use('/', userRoutes);
app.use('/', adminRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
