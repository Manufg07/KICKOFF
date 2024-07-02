const jwt = require('jsonwebtoken');
const User = require('../Models/UserDetails'); // Import your User model

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Authentication token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;
