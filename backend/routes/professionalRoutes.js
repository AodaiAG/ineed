// professionalRoutes.js
const express = require('express');
const router = express.Router();
const { verifyOrCreateProfessional } = require('../controllers/professionalController');

router.post('/verify-or-create', verifyOrCreateProfessional);

module.exports = router;
