const axios = require('axios');
const OpenAI = require('openai');
const JobType = require('../models/jobTypeModel'); // Import your Sequelize model
const PhoneVerification = require('../models/PhoneVerification');
const {grantClientAuth} = require('./authController');
const { Client, ClientRequest, Request } = require('../models/index'); // Adjust path if necessary
const Professional = require('../models/professional'); // Adjust path if necessary
const { ProfessionalRating } = require("../models/index");
const Notification = require('../models/notifications/Notification'); // Adjust the path if necessary
const Cancellation = require('../models/Cancellation');
const { notifyMatchingProfessionals } = require('./professionalController');


const ADMIN_USER_ID = "Admin_v2"; // New Admin ID




const { StreamChat } = require("stream-chat");

// Stream Chat credentials
const STREAM_API_KEY = "nr6puhgsrawn";
const STREAM_API_SECRET = "kb22mfy754kdex5vanjhsbmv37ujhzmj95vk5chx299wvd6p6evep5ps9azvs5kd";

// Initialize Stream server client
// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // OpenAI API key
});

exports.generateUserToken = async (req, res) => {
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    const { id, type } = req.body; // Extract id and type from the request body

    if (!id || !type) {
        return res.status(400).json({ error: "User ID and type are required" });
    }

    try {
        // Validate the type to ensure it is either 'client' or 'prof'
        if (type !== 'client' && type !== 'prof') {
            return res.status(400).json({ error: "Invalid type. Must be 'client' or 'prof'" });
        }
        

        // Upsert the user with the specified role
        await serverClient.upsertUser({
            id,
            role: type, // Set the role based on the 'type' parameter
        });

        console.log(`User with ID ${id} and role ${type} upserted successfully`);

        // Generate a token for the user
        const token = serverClient.createToken(id);

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
    const clientId = req.user.id; // Extract client ID from JWT
    const status = req.query.type || "open"; // Default to 'open' if no status is provided

    try {
        // Fetch client requests with related request details
        const clientRequests = await ClientRequest.findAll({
            where: { clientId },
            attributes: [], // Exclude all fields from ClientRequest
            include: [
                {
                    model: Request,
                    as: "request", // Use the alias defined in the association
                    where: { status }, // Filter requests by status
                    include: [
                        {
                            model: ProfessionalRating,
                            as: "rating", // ✅ Include rating data
                            attributes: ["quality", "professionalism", "price"],
                            required: false, // ✅ Allow requests without a rating!
                        },
                    ],
                },
            ],

            order: [
                [{ model: Request, as: 'request' }, 'createdAt', 'DESC'], // ✅ Order by request creation date in descending order
            ],
        });

        if (!clientRequests.length) {
            return res.status(404).json({ success: false, message: "No requests found for this client" });
        }

        // Extract the request data and process ratings if needed
        const serializedRequests = clientRequests.map((clientReq) => {
            const request = clientReq.request.toJSON();
            request.numOfProfs = Array.isArray(request.quotations) ? request.quotations.length : 0; // Count quotations

            // ✅ Check if there's a rating, otherwise set values to `null`
            if (request.rating) {
                const { quality, professionalism, price } = request.rating;
                request.averageRating = ((quality + professionalism + price) / 3).toFixed(2);
            } else {
                request.averageRating = null; // ✅ No rating available
            }

            return request;
        });

        res.status(200).json({
            success: true,
            data: serializedRequests,
        });
    } catch (error) {
        console.error("Error fetching client requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.rateProfessional = async (req, res) => {
    try {
        const { requestId, qualityRating, professionalismRating, priceRating } = req.body;
        const clientId = req.user.id; // Extract from JWT (authenticated client)

        // ✅ 1. Fetch the request to get professionalId
        const request = await Request.findOne({ where: { id: requestId } });

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const professionalId = request.professionalId;

        if (!professionalId) {
            return res.status(400).json({ success: false, message: "No professional assigned to this request" });
        }

        // ✅ 2. Ensure the request is completed before allowing a rating
        if (request.status !== "closed") {
            return res.status(400).json({ success: false, message: "You can only rate completed jobs" });
        }
console.log('Qa:  '+ qualityRating
    +'pro : '+professionalismRating+ 'price : '+ priceRating
)
        // ✅ 3. Save the rating
        const rating = await ProfessionalRating.create({
            clientId,
            requestId,
            professionalId,
            quality: qualityRating,           // ✅ Fix field name
            professionalism: professionalismRating, // ✅ Fix field name
            price: priceRating,               // ✅ Fix field name
        });

        res.status(201).json({ success: true, message: "Rating submitted successfully", data: rating });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
  


exports.submitClientRequest = async (req, res) => {
    const { clientId, jobRequiredId, city, date, comment } = req.body;
    const streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

    try {
        console.log("Validating client existence...");
        const client = await Client.findByPk(clientId);
        if (!client) {
            console.log("Client not found");
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        console.log("Client validated:", clientId);

        console.log("Upserting client into Stream...");
        const clientData = {
            id: clientId,
            name: client.fullName || `Client_${clientId}`, // Fallback to a default name if fullName is missing
            image: client.image || '/default-client.png',
        };

        const clientExists = await streamClient.queryUsers({ id: clientId });
        if (clientExists.users.length === 0) {
            console.log("Client does not exist in Stream, creating user...");
            await streamClient.upsertUser({
                ...clientData,
               
            });
        } else {
            console.log("Client already exists in Stream, updating user...");
            await streamClient.partialUpdateUser({
                id: clientId,
                set: {
                    ...clientData,
                 
                },
            });
        }

        console.log("Client successfully created/updated in Stream:", clientData);

        console.log("Creating new request...");
        const request = await Request.create({
            jobRequiredId,
            city,
            date,
            comment,
        });
        console.log("Request created:", request.id);

        console.log("Linking request to client...");
        await ClientRequest.create({
            clientId,
            requestId: request.id,
        });
        console.log("Request linked to client:", clientId, "Request ID:", request.id);

        console.log("Creating chat channel for the request...");
        const channelId = `request_${request.id}`;
        const members = [clientId];
        const channel = streamClient.channel("messaging", channelId, {
            name: `Request ${request.id}`,
            members,
            created_by_id: clientId,
        });

        await channel.create();
        console.log("Chat channel created:", channelId);

        // Notify matching professionals about the new request
        console.log("Notifying matching professionals...");
        let notifyResponse = { success: false, data: [] };
        try {
            const notifyResult = await notifyMatchingProfessionals({ params: { requestId: request.id } }, { 
                status: () => ({ 
                    json: (data) => {
                        notifyResponse = data;
                    }
                }) 
            });
            console.log("Notification result:", notifyResult);
        } catch (notifyError) {
            console.error("Error notifying professionals:", notifyError);
        }

        res.status(201).json({
            success: true,
            data: {
                requestId: request.id,
                channelId: channelId,
                notifiedProfessionals: notifyResponse
            },
            message: "Client request and chat channel created successfully",
        });
    } catch (error) {
        console.error("Error submitting client request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


  
  
  
  
exports.updateSelectedProfessional = async (req, res) => {
    const { requestId, professionalId } = req.body;
    const clientId = req.user.id; // Assuming clientId is in the decoded JWT



    try {
        // Verify ownership using ClientRequest
        const clientRequest = await ClientRequest.findOne({
            where: { requestId, clientId }, // Ensure the client owns the request
        });

        if (!clientRequest) {
            console.log("Access denied: Client does not own the request");
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Fetch the request to update
        const request = await Request.findByPk(requestId);

        if (!request) {
            console.log("Request not found");
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Update the professionalId field
        await request.update({ professionalId });
        await Notification.create({
            recipientId: professionalId.toString(),
            recipientType: 'professional',
            messageKey: 'notifications.professionalSelected', // Key for translation
            requestId,
            action: `/pro/requests/${requestId}`, // Add action to navigate to the request details page
            isRead: false,
          });

        console.log("Updated Request Professional ID:", professionalId);

        res.json({ success: true, message: 'Professional selected successfully.' });
    } catch (error) {
        console.error('Error updating professional:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getRequestDetails = async (req, res) => {
    const { requestId } = req.params;
    const clientId = req.user.id; // Assuming clientId is in the decoded JWT


    try {
        // Fetch the request details through ClientRequest
        const clientRequest = await ClientRequest.findOne({
            where: { requestId, clientId }, // Ensure the client owns the request
            include: [
                {
                    model: Request,
                    as: 'request', // Alias for the Request model
                    required: true, // Ensure it only includes if the Request exists
                },
            ],
        });


        if (!clientRequest) {
            return res.status(404).json({ success: false, message: 'Request not found or access denied' });
        }

        const request = clientRequest.request;

        // Fetch the professional details associated with quotations
        const quotations = request.quotations || [];

        const professionalIds = quotations.map((q) => q.professionalId);

        const professionals = await Professional.findAll({
            where: { id: professionalIds },
            attributes: ['id', 'fname', 'lname', 'image'], // Select necessary fields
        });


        // Merge professional details with quotations
        const quotationsWithDetails = quotations.map((q) => {
            const professional = professionals.find((p) => p.id === q.professionalId);
            return {
                professionalId: q.professionalId,
                price: q.price,
                name: professional ? `${professional.fname} ${professional.lname}` : 'Unknown',
                image: professional ? professional.image : null,
            };
        });


        res.status(200).json({
            success: true,
            data: {
                request: {
                    id: request.id,
                    jobRequiredId: request.jobRequiredId,
                    city: request.city,
                    date: request.date,
                    comment: request.comment,
                    status: request.status,
                    professionalId: request.professionalId, // Add this line
                    imageUrls: request.imageUrls || [], // ✅ Include image URLs, defaulting to an empty array


                },
                quotations: quotationsWithDetails,
            },
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
    try {
        // 1️⃣ Get the user query and language from request body
        const { query, lang = "he" } = req.body;


        if (!query) {
            return res.status(400).json({ error: "Query is required in request body" });
        }

        // 2️⃣ Get the correct table name for the selected language
        const tableName = getTableNameForLanguage(lang);

        if (!tableName) {
            return res.status(400).json({ error: "Invalid language parameter" });
        }

        // 3️⃣ Dynamically create the JobType model with the correct table
        const JobTypeModel = JobType(tableName);

        // 4️⃣ Fetch a **smaller subset** of job types (LIMIT: 300)
        const jobTypes = await JobTypeModel.findAll({
            attributes: ["id", "main", "sub"], // ✅ **Include ID**
            limit: 300 // ✅ **Further reduced to avoid token limit**
        });


        if (!jobTypes.length) {
            return res.status(404).json({ error: `No job types found for language: ${lang}` });
        }

        // 5️⃣ Convert job list to a **minimal format** for AI **(Including ID)**
        const jobList = jobTypes.map(job => `${job.id}: ${job.main} > ${job.sub}`).join("\n");


        // 6️⃣ Call OpenAI API with the **correct format including IDs**
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: `From the following job categories, return the most relevant job category IDs (max 3) for the user query:\n\n${jobList}\n\nUser query: ${query}\n\nOnly return a JSON array of IDs like this: [9, 12, 15]. No explanations.` }
            ],
            max_tokens: 200 // ✅ **Further reduced max tokens**
        });


        // 7️⃣ Parse AI response
        let aiMatches;
        try {
            aiMatches = JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error("❌ Error parsing AI response:", error);
            return res.status(500).json({ error: "Failed to process AI response" });
        }

        // 8️⃣ Validate AI response format (should be an array of numbers)
        if (!Array.isArray(aiMatches) || !aiMatches.every(id => typeof id === "number")) {
            return res.status(400).json({ error: "AI response format is invalid" });
        }

        // 9️⃣ Limit to top 3 results
        return res.json(aiMatches.slice(0, 3));

    } catch (error) {
        console.error("❌ Error in search function:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



exports.getClientInfo = async (req, res) => {
    try {
      const { clientId } = req.params;
  
      const client = await Client.findByPk(clientId);
  
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
  
      res.json({
        id: client.id,
        fullName: client.fullName || "לקוח בדוי",
        phoneNumber: client.phoneNumber,
        isVerified: client.isVerified,
      });
    } catch (error) {
      console.error("Error fetching client info:", error);
      res.status(500).json({ message: "Internal server error" });
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

        console.log(phoneNumber , code)
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


exports.validateRatingRequest = async (req, res) => {
    try {
        const { requestId } = req.params; 
        const clientId = req.user.id; // Extract client ID from JWT

        // ✅ 1. Check if the request exists and is linked to the client
        const clientRequest = await ClientRequest.findOne({
            where: { requestId, clientId }, // Ensure the request belongs to the client
            include: [
                {
                    model: Request,
                    as: "request",
                },
            ],
        });

        if (!clientRequest) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: This request does not belong to you.",
            });
        }

        // ✅ 2. Ensure the request is completed
        if (clientRequest.request.status !== "closed") {
            return res.status(400).json({
                success: false,
                message: "You can only rate completed jobs.",
            });
        }

        // ✅ 3. Check if the rating already exists
        const existingRating = await ProfessionalRating.findOne({
            where: { requestId, clientId }
        });

        if (existingRating) {
            return res.status(409).json({
                success: false,
                message: "You have already rated this professional.",
            });
        }

        // ✅ 4. If everything is valid, allow rating
        res.status(200).json({
            success: true,
            message: "You can rate this professional.",
        });

    } catch (error) {
        console.error("Error validating rating request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const clientId = req.user.id; // Extract client ID from JWT
        const { reason, details } = req.body;

        // ✅ 1. Find the request
        const request = await Request.findOne({ where: { id: requestId } });

        if (!request) {
            return res.status(404).json({ success: false, message: "הקריאה לא נמצאה" });
        }

        // ✅ 2. Check if the request belongs to the client
        const clientRequest = await ClientRequest.findOne({
            where: { requestId, clientId },
        });

        if (!clientRequest) {
            return res.status(403).json({ success: false, message: "הקריאה אינה שייכת לך" });
        }

        const professionalId = request.professionalId;

        await Cancellation.create({
            requestId,
            cancelledId: clientId.toString(), // ID of the client who canceled
            reason,
            cancelledBy: 'client',
        });
        // ✅ 4. Delete the request
        await Request.destroy({ where: { id: requestId } });

        // ✅ 5. Send notification to the professional if assigned
        if (professionalId) {
            await Notification.create({
                recipientId: professionalId.toString(),
                recipientType: 'professional',
                messageKey: 'notifications.requestCancelled',
                requestId,
                action: null,
                isRead: false,
            });
        }

        res.status(200).json({ success: true, message: "הקריאה בוטלה בהצלחה" });
    } catch (error) {
        console.error("Error canceling request:", error);
        res.status(500).json({ success: false, message: "שגיאה פנימית בשרת" });
    }
};

