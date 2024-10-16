const axios = require('axios');
const OpenAI = require('openai');
const JobType = require('../models/jobTypeModel'); // Import your Sequelize model
const RequestModel = require('../models/requestModel'); // Import your Sequelize model

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // OpenAI API key
});

// Get address from lat/lon (Reverse geocoding)
exports.getGeocode = async (req, res) => {
    const { lat, lon } = req.query;
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${lat},${lon}`,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        if (response.data.results.length > 0) {
            res.json(response.data.results[0].formatted_address);
        } else {
            res.status(404).json({ error: 'Address not found' });
        }
    } catch (error) {
        console.error('Failed to fetch address:', error);
        res.status(500).json({ error: 'Failed to fetch address' });
    }
};
// Verify phone number using the verification code
exports.verifyCode = async (req, res) => {
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
};
exports.submitData = async (req, res) => {
    const { name, codeN, phone, note, jobTypeId, main, sub, location, dateAndTime } = req.body;
    const fullPhoneNumber = codeN + phone;
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code

    try {
        // Store form data in the database
        const newRequest = await RequestModel.create({
            job_type: jobTypeId,
            main_type: main,
            sub_type: sub,
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
            jobId
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, message: 'Error submitting form.' });
    }
};


// Get autocomplete suggestions for an address
exports.getAutocomplete = async (req, res) => {
    const { input } = req.query;
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        res.json(response.data.predictions);
    } catch (error) {
        console.error('Failed to fetch autocomplete suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch autocomplete suggestions' });
    }
};

// Controller function for handling AI-based job search
exports.search = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    try {
        // Step 1: Fetch all job types from the database
        const jobTitles = await JobType.findAll({
            attributes: ['main', 'sub']
        });

        // Convert job titles to a format the AI can understand
        const jobList = jobTitles.map(job => `${job.main} - ${job.sub}`).join('\n');

        // Step 2: Get AI's matching job suggestion based on the query and job titles
        const aiJobType = await getAiJobMatch(query, jobList);

        // Step 3: If AI provides a valid suggestion, search the job_type table
        if (aiJobType) {
            const matchingJob = await JobType.findOne({
                where: {
                    main: aiJobType.main,
                    sub: aiJobType.sub
                }
            });

            if (matchingJob) {
                return res.json({
                    success: true,
                    jobType: matchingJob
                });
            } else {
                const firstJob = jobTitles[0];
                return res.json({
                    success: true,
                    jobType: {
                        main: firstJob.main,
                        sub: firstJob.sub
                    }
                });
            }
        } else {
            const firstJob = jobTitles[0];
            return res.json({
                success: true,
                jobType: {
                    main: firstJob.main,
                    sub: firstJob.sub
                }
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, message: 'Error performing search' });
    }
};
exports.getMainProfessions = async (req, res) => {
    try {
        const mainProfessions = await JobType.findAll({
            attributes: ['main'],  // Fetch 'main' column
            group: 'main'
        });
        res.json(mainProfessions);
    } catch (error) {
        console.error('Failed to fetch main professions:', error);
        res.status(500).json({ error: 'Failed to fetch main professions' });
    }
};

// Get sub professions based on main profession
exports.getSubProfessions = async (req, res) => {
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
};

// Function to interact with the OpenAI API and get a job type match
const getAiJobMatch = async (query, jobList) => {
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant' },
                { role: 'user', content: `From the following data, please match the most appropriate main and sub categories for the user query: \n\n${jobList}\n\nUser query: ${query}\n\nPlease respond with only the main and sub values from the data provided, without any additional text.` }
            ],
            max_tokens: 100
        });

        const text = response.choices[0].message.content;
        const suggestions = parseSuggestions(text);

        return suggestions.length > 0 ? suggestions[0] : null;
    } catch (error) {
        console.error('AI suggestion error:', error);
        return null;
    }
};
