const express = require('express');
const router = express.Router();
const JobType = require('../models/jobTypeModel'); // Import your Sequelize model
const RequestModel = require('../models/requestModel'); // Import your Sequelize model


const locationController = require('../controllers/locationController');
// Import controllers
const { sendVerificationCode, verifyCode } = require('../controllers/phoneController');
const { search } = require('../controllers/searchController');


// Define routes

// Search route
router.get('/search', search);

// Route to get reverse geocode (address from lat/lon)
router.get('/geocode', locationController.getGeocode);

// Route to get autocomplete suggestions
router.get('/autocomplete', locationController.getAutocomplete);

// Store Location Route
//router.post('/store-location', locationController.storeLocation);
// Phone verification routes
//router.post('/phone/verify', sendVerificationCode);     // Send verification code
//router.post('/phone/verify-code', verifyCode);          // Verify the code




router.post('/submit-data', async (req, res) => {
    const { name, codeN, phone, note, jobTypeId, main, sub, location, dateAndTime } = req.body;
    const fullPhoneNumber = codeN + phone;
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code

    try {
        // Store form data in the database
        const newRequest = await RequestModel.create({
            job_type: jobTypeId,
            main_type: main, // Include main_type
            sub_type: sub, // Corrected: Should use sub instead of main
            job_location: location,
            job_timestamp: dateAndTime,
            client_name: name,
            client_phone: fullPhoneNumber,
            sms_verification: verificationCode,
            job_agent: null,
            job_finished: false,
            job_price: null,
            job_image: null,
            job_rate: null,
            customer_description: note
        });

        // Retrieve the job ID from the newly created record
        const jobId = newRequest.id;

        // Send SMS with Twilio
        //await sendVerificationCode(fullPhoneNumber, verificationCode);

        // Return success response with the job ID
        res.status(200).json({
            success: true,
            message: 'Form submitted successfully, verification code sent.',
            jobId // Include jobId in the response
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, message: 'Error submitting form.' });
    }
});
router.post('/verify-code', async (req, res) => {
    const { requestId, phone, code } = req.body;

    console.log('Received data:', { requestId, phone, code }); // Log the incoming data

    try {
        // Fetch the request from the database based on provided jobId, phone, and code
        const request = await RequestModel.findOne({
            where: { id: requestId, client_phone: phone, sms_verification: code }
        });

        console.log('Database query result:', request); // Log the result of the query

        if (request) {
            // Update the request to mark SMS verification as complete
            request.sms_verification = 'active';
            await request.save();

            console.log('SMS verification updated successfully:', request); // Log successful update

            res.status(200).json({ success: true, message: 'Phone number verified successfully.' });
        } else {
            console.log('Invalid code or phone number.'); // Log invalid case
            res.status(400).json({ success: false, message: 'Invalid code or phone number.' });
        }
    } catch (error) {
        console.error('Error verifying code:', error); // Log any error encountered
        res.status(500).json({ success: false, message: 'Error verifying phone number.' });
    }
});


router.get('/main-professions', async (req, res) => {
    try {
        const mainProfessions = await JobType.findAll({
            attributes: [ 'main'],  // Fetch 'id' and 'main' columns
            group: 'main'
        });
        res.json(mainProfessions);
    } catch (error) {
        console.error('Failed to fetch main professions:', error);
        res.status(500).json({ error: 'Failed to fetch main professions' });
    }
});

router.get('/sub-professions/:main', async (req, res) => {
    const mainCategory = req.params.main;
    try {
        const subProfessions = await JobType.findAll({
            where: { main: mainCategory },  // Fetch sub professions where main = selected main
            attributes: ['id', 'sub']       // Fetch 'id' and 'sub' columns
        });
        res.json(subProfessions);
    } catch (error) {
        console.error('Failed to fetch sub professions:', error);
        res.status(500).json({ error: 'Failed to fetch sub professions' });
    }
});
module.exports = router;
