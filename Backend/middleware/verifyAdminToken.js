const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.AuthToken || req.headers['authorization'];

    if (!token) {
        return res.redirect('/auth/admin/login');
    }

    jwt.verify(token, "your-secret-key", (err, decoded) => {
        if (err) {
            return res.redirect('/auth/admin/login');
        }
        req.admin = decoded;
        next();
    });
};

module.exports = verifyAdminToken;
