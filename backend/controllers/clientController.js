const axios = require('axios');
const OpenAI = require('openai');
const JobType = require('../models/jobTypeModel'); // Import your Sequelize model
const { StreamChat } = require("stream-chat");
const PhoneVerification = require('../models/PhoneVerification');
const {grantClientAuth} = require('./authController');
const { Client, ClientRequest, Request } = require('../models/index'); // Adjust path if necessary





// Stream Chat credentials
const STREAM_API_KEY = "v5t2erh2ur73";
const STREAM_API_SECRET = "a9tdds8favzc9jbk4wd53w4sgx5rd9fz47cxkcsgpw4f4cdtfc9ztcyrax5dhy77";

// Initialize Stream server client
// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // OpenAI API key
});

exports.generateUserToken = async (req, res) => {
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    const { id } = req.body;
    // Validate the request
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Generate a token for the provided user ID
        const token = serverClient.createToken(id);

        // Respond with the token
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ success: false, message: "Failed to generate user token" });
    }
};
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


exports.saveClient = async (req, res) => {
    const { phoneNumber, fullName } = req.body;
  
    try {
      // Check if the client already exists based on the phone number
      let client = await Client.findOne({ where: { phoneNumber } });
  
      if (client) {
        // Client exists, return the ID
        console.log('Client already exists:', client.id);
        return res.status(200).json({
          success: true,
          clientId: client.id,
          message: 'Client already exists',
        });
      }
  
      // Client does not exist, create a new one
      client = await Client.create({ phoneNumber, fullName });
  
      // Generate authentication tokens and set them in headers
      await grantClientAuth(client, res);
  
      // Return success status and client ID
      res.status(201).json({
        success: true,
        clientId: client.id, // Include the client ID in the response
        message: 'Client created successfully',
      });
    } catch (error) {
      console.error('Error saving client:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  exports.getClientRequests = async (req, res) => {
    const clientId = req.user.id; // Extract client ID from the decoded JWT
  
    try {
      // Fetch client requests along with request details
      const clientRequests = await ClientRequest.findAll({
        where: { clientId }, // Filter by clientId
        attributes: [], // Exclude all fields from ClientRequest
        include: [
          {
            model: Request,
            as: 'request', // Specify the alias defined in the association
            attributes: { exclude: [] }, // Include all fields from Request
        },
        ],
      });
  
      if (!clientRequests.length) {
        return res.status(404).json({ success: false, message: 'No requests found for this client' });
      }
  
      // Extract the request data only
      const serializedRequests = clientRequests.map((req) => req.request.toJSON());
  
      res.status(200).json({
        success: true,
        data: serializedRequests, // Send only the request details
      });
    } catch (error) {
      console.error('Error fetching client requests:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  
  

  exports.submitClientRequest = async (req, res) => {
    const { clientId, jobRequiredId, city, date, comment, profId } = req.body;
  
    try {
      // Validate client existence
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }
  
    
  
      // Create a new request
      const request = await Request.create({
        jobRequiredId, // Use jobRequiredId to reference the JobType table
        city,
        date,
        comment,
      });
  
      // Link the request to the client in the ClientRequest table
      const clientRequest = await ClientRequest.create({
        clientId,
        requestId: request.id,
        profId, // Optional, depending on your requirements
      });
  
      // Respond with success
      res.status(201).json({
        success: true,
        data: {
          requestId: request.id,
          clientRequestId: clientRequest.id,
        },
        message: 'Client request submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting client request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  exports.getRequestDetails = async (req, res) => {
    const { requestId } = req.params;
    const clientId = req.user.id; // Assuming clientId is in the decoded JWT

    try {
        // Fetch the request details via the ClientRequest model
        const clientRequest = await ClientRequest.findOne({
            where: { requestId },
            include: [
                {
                    model: Request,
                    as: 'request', // Alias for the association
                    required: true, // Ensure the join only happens if a related Request exists
                },
            ],
        });

        // Check if the request exists
        if (!clientRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Ensure the logged-in user is the owner of the request
        if (clientRequest.clientId !== clientId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Extract raw request data
        const requestData = clientRequest.request.get({ plain: true });

        res.status(200).json({
            success: true,
            data: requestData, // Return only the plain request data
        });
    } catch (error) {
        console.error('Error fetching request details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.deleteClientRequest = async (req, res) => {
    const { clientRequestId } = req.params;

    try {
        // Delete the client request
        const deleted = await ClientRequest.destroy({ where: { id: clientRequestId } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Client request not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Client request deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting client request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
exports.getDomains = async (req, res) => {
    const lang = req.params.lang || 'he'; // Get language from params, default to Hebrew if not provided
    const tableName = getTableNameForLanguage(lang); // Get the correct table name based on the language code

    try {
        const JobTypeModel = JobType(tableName); // Create the model with the correct table name
        const domains = await JobTypeModel.findAll({
            attributes: ['domain'],  // Fetch 'domain' column
            group: 'domain'
        });
        res.json(domains);
    } catch (error) {
        console.error('Failed to fetch domains:', error);
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
};

exports.verifyCodeHandler = async (req, res) => {
    const { phoneNumber, code } = req.body;

    try {
        // Check if the client is registered
        const client = await Client.findOne({ where: { phoneNumber } });
        const isRegistered = Boolean(client);

        // Retrieve the verification record
        const verificationRecord = await PhoneVerification.findOne({ where: { phoneNumber } });

        // If no verification record exists, return an error
        if (!verificationRecord) {
            return res.status(401).json({
                success: false,
                data: { registered: isRegistered },
                message: 'Verification record not found',
            });
        }

        const { code: storedCode, expiresAt } = verificationRecord;

        // Check if the code is expired or invalid
        if (new Date() > expiresAt || storedCode !== code) {
            return res.status(401).json({
                success: false,
                data: { registered: isRegistered },
                message: 'Code expired or invalid',
            });
        }

        // If the client is registered, grant auth tokens
        if (isRegistered) {
            await grantClientAuth(client, res); // Replace with client-specific auth grant logic
            return res.status(200).json({
                success: true,
                data: {
                    clientId: client.id,
                    registered: true,
                },
                message: 'Verification successful',
            });
        }

        // If the client is not registered, return success and prompt registration
        return res.status(200).json({
            success: true,
            data: { phoneNumber, registered: false },
            message: 'Verification successful, but user not registered',
        });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.getMainProfessions = async (req, res) => {
    const lang = req.params.lang || 'he'; // Get language from params, default to Hebrew if not provided
    const domain = req.query.domain; // Get domain from query parameters
    const tableName = getTableNameForLanguage(lang); // Get the correct table name based on the language code

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' }); // Return error if domain is not provided
    }

    try {
        const JobTypeModel = JobType(tableName); // Create the model with the correct table name
        const mainProfessions = await JobTypeModel.findAll({
            where: { domain }, // Filter by domain
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
    const lang = req.params.lang || 'he'; // Get language from params, default to Hebrew if not provided
    const mainCategory = req.params.main;
    const tableName = getTableNameForLanguage(lang); // Get the correct table name based on the language code

    try {
        const JobTypeModel = JobType(tableName); // Create the model with the correct table name
        const subProfessions = await JobTypeModel.findAll({
            where: { main: mainCategory },  // Fetch sub professions where main = selected main
            attributes: ['id', 'sub']       // Fetch 'id' and 'sub' columns
        });
        res.json(subProfessions);
    } catch (error) {
        console.error('Failed to fetch sub professions:', error);
        res.status(500).json({ error: 'Failed to fetch sub professions' });
    }
};
const getTableNameForLanguage = (lang) => {
    switch (lang) {
        case 'he': return 'job_type';     // Hebrew
        case 'ar': return 'job_type_ar';  // Arabic
        case 'en': return 'job_type_en';  // English
        case 'es': return 'job_type_es';  // Spanish
        case 'ru': return 'job_type_ru';  // Russian
        default: return 'job_type';       // Default to Hebrew if language is not recognized
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
