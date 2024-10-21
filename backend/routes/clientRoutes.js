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
router.get('/:lang/main-professions', getMainProfessions);

// Route to fetch sub-professions with language and main category parameters
router.get('/:lang/sub-professions/:main', getSubProfessions);



module.exports = router;
