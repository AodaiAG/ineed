// professionalRoutes.js
const express = require('express');
const router = express.Router();
const { checkIfRegistered } = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered);

module.exports = router;
