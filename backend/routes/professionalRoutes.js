// professionalRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });
const authenticateToken = require('../middleware/authenticateToken');



const { checkIfRegistered,
    getAllLocations,
    registerProfessional,
    getProfessionalById,updateProfessional ,uploadImage,generateVerificationCodeHandler
    ,verifyCodeHandler,createReportMissingProfession,downloadVCardHandler
 } = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered); // check if the user registerd or not
router.post('/register', registerProfessional);
router.get('/locations', getAllLocations); //  route for fetching locations
router.get('/prof-info/:id', getProfessionalById);
router.put('/update', authenticateToken,updateProfessional);
router.post('/send-sms', generateVerificationCodeHandler); // Generate and send SMS with verification code
router.post('/verify-code', verifyCodeHandler); // Verify the SMS verification code
router.post('/upload-image', upload.single('image'), uploadImage);
router.post('/report-missing-profession', createReportMissingProfession);
router.get('/vcard/:id', downloadVCardHandler);





module.exports = router;
