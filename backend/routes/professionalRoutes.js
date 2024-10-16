// professionalRoutes.js
const express = require('express');
const router = express.Router();
const { checkIfRegistered,getAllLocations } = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered); // check if the user registerd or not
router.get('/locations', getAllLocations); //  route for fetching locations


module.exports = router;
