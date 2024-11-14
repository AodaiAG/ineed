const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
// Route to refresh the access token

router.get('/verify-auth', authenticateToken, authController.verifyAuth);


// Route to log out (clears tokens)
router.post('/logout', authController.logout);

module.exports = router;
