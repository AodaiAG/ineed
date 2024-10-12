const express = require('express');
const router = express.Router();
const { getDashboardData, updateProfile } = require('../controllers/professionalController');

// Route to get the professional's dashboard data
router.get('/dashboard', getDashboardData);

// Route to update professional profile
router.put('/profile', updateProfile);

module.exports = router;
