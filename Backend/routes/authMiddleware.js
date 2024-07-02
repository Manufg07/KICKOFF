const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// In auth.js or a similar file handling authentication

// async function login(username, password) {
//     try {
//         const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username, password }),
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         localStorage.setItem('token', data.token);
        
//         // Redirect to home page or refresh the current page
//         window.location.href = '/home'; // or wherever you want to redirect after login
//     } catch (error) {
//         console.error('Login failed', error);
//         // Show error message to the user
//     }
// }

// // You would typically call this function when the user submits a login form
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     login(username, password);
// });