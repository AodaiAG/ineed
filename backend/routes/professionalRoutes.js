// professionalRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });
const authenticateToken = require('../middleware/authenticateToken');

const { 
    checkIfRegistered,
    getAllLocations,
    assignRequestToProfessional,
    fetchProfRequests,
    updateQuotation,
    cancelRequest,
    fetchProfessionById,
    fetchProfessionalRequests,
    registerProfessional,
    getProfessionalById,
    updateProfessional,
    uploadImage,
    generateVerificationCodeHandler,
    verifyCodeHandler,
    createReportMissingProfession,
    downloadVCardHandler,
    addProfessionalToChannel,
    getProfessionalRequestDetails,
    finishRequest,
    notifyMatchingProfessionals
} = require('../controllers/professionalController');

router.post('/check-if-registered', checkIfRegistered); // check if the user registerd or not
router.post('/register', registerProfessional);
router.get('/locations', getAllLocations); //  route for fetching locations
router.get('/prof-info/:id', getProfessionalById);
router.put('/update', updateProfessional);
router.post('/send-sms', generateVerificationCodeHandler); // Generate and send SMS with verification code
router.post('/verify-code', verifyCodeHandler); // Verify the SMS verification code
router.post('/upload-image', upload.single('image'), uploadImage);
router.post('/report-missing-profession', createReportMissingProfession);
router.get('/vcard/:id', downloadVCardHandler);
router.post('/finish-request', authenticateToken, finishRequest);

//
router.post('/assign-request', authenticateToken, assignRequestToProfessional);

router.get('/my-requests', authenticateToken, fetchProfessionalRequests);

router.get('/get-prof-requests', authenticateToken, fetchProfRequests);
router.post('/quotation', authenticateToken, updateQuotation);

router.post("/join-chat", addProfessionalToChannel);

router.get("/request/:requestId", authenticateToken, getProfessionalRequestDetails);

router.get('/profession/:id/:language', fetchProfessionById);

router.post("/cancel-request", authenticateToken, cancelRequest);

router.get('/notify-matching-professionals/:requestId', notifyMatchingProfessionals);

module.exports = router;
