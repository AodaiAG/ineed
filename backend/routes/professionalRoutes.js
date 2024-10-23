// professionalRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });


const { checkIfRegistered,
    getAllLocations,
    registerProfessional,
    getProfessionalById,updateProfessional ,uploadImage
 } = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered); // check if the user registerd or not
router.post('/register', registerProfessional);
router.get('/locations', getAllLocations); //  route for fetching locations
router.get('/prof-info/:id', getProfessionalById);
router.put('/update', updateProfessional);

router.post('/upload-image', upload.single('image'), uploadImage);




module.exports = router;
