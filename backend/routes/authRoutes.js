const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authenticateClientToken = require('../middleware/AuthenticateClientToken');

// Route to refresh the access token

router.get('/verify-auth', authenticateToken, authController.verifyAuth);
router.get('/verify-client', authenticateClientToken, authController.verifyClientAuth);



// Route to log out (clears tokens)
router.post('/logout', authController.logout);

module.exports = router;
