const express = require('express');
const router = express.Router();

const {
    getGeocode,
    getAutocomplete,
    search,
    submitData,
    verifyCode,
    getMainProfessions,
    getSubProfessions
} = require('../controllers/clientController');

router.get('/search', search);
router.get('/geocode', getGeocode);
router.get('/autocomplete',getAutocomplete);
router.post('/submit-data', submitData);
router.post('/verify-code', verifyCode); // Add the route to link the verifyCode function
router.get('/main-professions', getMainProfessions); // Add the route for main professions
router.get('/sub-professions/:main', getSubProfessions); // Add the route for sub professions



module.exports = router;
