const express = require('express');
const router = express.Router();
const tokenMiddleware = require('../middleware/AuthenticateClientToken');

const {
    getGeocode,
    getAutocomplete,
    search,
    verifyCode,
    getMainProfessions,
    getSubProfessions,
    getDomains,
    verifyCodeHandler,
    generateUserToken,saveClient,submitClientRequest,getClientRequests,getRequestDetails,deleteClientRequest
} = require('../controllers/clientController');
////
router.post('/save_client', saveClient);
router.post('/submit_client_request', submitClientRequest);
router.get('/my_requests', tokenMiddleware,getClientRequests);
router.get('/request/:requestId',tokenMiddleware, getRequestDetails);
router.delete('/request/:clientRequestId', deleteClientRequest);
//
router.get('/search', search);
router.get('/geocode', getGeocode);
router.get('/autocomplete',getAutocomplete);

router.post("/generate-user-token", generateUserToken);
router.post('/verify-code', verifyCodeHandler); // Verify the SMS verification code

router.get('/:lang/main-professions', getMainProfessions);
router.get('/:lang/domains', getDomains); // Add the route to link the getDomains function

// Route to fetch sub-professions with language and main category parameters
router.get('/:lang/sub-professions/:main', getSubProfessions);




module.exports = router;
