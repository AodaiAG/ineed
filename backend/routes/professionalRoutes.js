// professionalRoutes.js
const express = require('express');
const router = express.Router();
const { checkIfRegistered,
    getAllLocations,
    registerProfessional,
    getProfessionalById,updateProfessional
 } = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered); // check if the user registerd or not
router.post('/register', registerProfessional);
router.get('/locations', getAllLocations); //  route for fetching locations
router.get('/prof-info/:id', getProfessionalById);
router.put('/update', updateProfessional);



module.exports = router;
