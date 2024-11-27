// professionalController.js
const Professional = require('../models/professional');
const PhoneVerification = require('../models/PhoneVerification');
const Location = require('../models/Location'); // Import the Location model
const ReportMissingProfession = require('../models/ReportMissingProfession');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');
const {grantProfAuth} = require('./authController');
const { Op } = require('sequelize');


const { StreamChat } = require("stream-chat");

// Stream Chat credentials
const STREAM_API_KEY = "v5t2erh2ur73";
const STREAM_API_SECRET = "a9tdds8favzc9jbk4wd53w4sgx5rd9fz47cxkcsgpw4f4cdtfc9ztcyrax5dhy77";


const multer = require('multer');
const streamifier = require('streamifier');

const axios = require('axios');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken'); // Import RefreshToken model
const { Client, ClientRequest, Request } = require('../models/index'); // Adjust path if necessary


// Functions to generate tokens
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const cloudinary = require('../config/cloudinaryConfig'); // Import the Cloudinary config
const storage = multer.memoryStorage();



const uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Use a stream to upload the image to Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'Professionals', resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
          }
          // Return the URL of the uploaded image
          return res.status(200).json({ imageUrl: result.secure_url });
        }
      );
  
      // Use streamifier to create a readable stream from the buffer
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const createReportMissingProfession = async (req, res) => {
    const { domain, isMissing, mainProfession, additionalSubProfession } = req.body;
  
    try {
      const report = await ReportMissingProfession.create({
        domain,
        isMissing,
        mainProfession,
        additionalSubProfession,
      });
  
      res.status(201).json({ success: true, message: 'Report created successfully', report });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ success: false, message: 'Error creating report', error });
    }
  };

const checkIfRegistered = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Find a professional with the given phone number
        const professional = await Professional.findOne({ where: { phoneNumber } });

        if (professional) {
            return res.status(200).json({ registered: true, id: professional.id });
        } else {
            return res.status(200).json({ registered: false });
        }
    } catch (error) {
        console.error('Error checking if professional is registered:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const getAllLocations = async (req, res) => {
    try {
        const { lang } = req.query;  // Get the language from query parameters

        // Determine the language columns based on the 'lang' parameter
        let cityNameColumn = 'City_Name_Eng';  // Default to English
        let areaNameColumn = 'Area_English';   // Default to English

        if (lang === 'he') {
            cityNameColumn = 'City_Name';
            areaNameColumn = 'Area_Name';
        }

        // Fetch all locations with the correct language columns
        const locations = await Location.findAll({
            attributes: ['City_ID', cityNameColumn, 'Area_ID', areaNameColumn]
        });

        // Group locations by Area_ID and the chosen area name
        const groupedLocations = locations.reduce((acc, location) => {
            const { Area_ID, City_ID } = location;
            const areaName = location[areaNameColumn];  // Dynamic area name
            const cityName = location[cityNameColumn];  // Dynamic city name

            // Find if area already exists in the accumulator
            let area = acc.find(a => a.areaId === Area_ID);

            if (!area) {
                // If the area doesn't exist, create a new area entry
                area = {
                    areaId: Area_ID,
                    areaName: areaName,
                    cities: []
                };
                acc.push(area);
            }

            // Add the city to the corresponding area
            area.cities.push({
                cityId: City_ID,
                cityName: cityName
            });

            return acc;
        }, []);

        // Respond with the grouped locations
        res.status(200).json(groupedLocations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
//before changing the backend

const registerProfessional = async (req, res) => {
    const {
        phoneNumber,
        fullName,
        email,
        website,
        businessName,
        image,
        availability24_7,
        dayAvailability,
        professions,
        workAreas,
        languages,
        location,
    } = req.body;

    try {
        const [fname, ...lnameParts] = fullName.split(' ');
        const lname = lnameParts.join(' ');

        const newProfessional = await Professional.create({
            phoneNumber,
            fname,
            lname,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability,
            professions,
            workAreas,
            languages,
            location,
        });

        // Grant auth tokens for the new professional
        await grantProfAuth(newProfessional, res);

        res.status(201).json({
            message: 'Professional registered successfully',
            data: newProfessional, // Professional info only, no tokens here
        });

    } catch (error) {
        console.error('Error registering professional:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfessionalById = async (req, res) => {
    const { id } = req.params;

    try {
        const professional = await Professional.findByPk(id);

        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        res.status(200).json(professional);
    } catch (error) {
        console.error('Error fetching professional data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProfessional = async (req, res) => {
    const {
        professionalId,  // Ensure this is coming from the request body
        phoneNumber,
        fullName,
        email,
        website,
        businessName,
        image,
        availability24_7,
        dayAvailability,
        mainProfessions,
        subProfessions,
        workAreas,
        languages,
        location,
    } = req.body;

    try {
        // Check if `professionalId` exists
        if (!professionalId) {
            return res.status(400).json({ error: 'Professional ID is required for updating.' });
        }

        // Split the full name into first name and last name (assuming space separates them)
        const [fname, ...lnameParts] = fullName.split(' ');
        const lname = lnameParts.join(' ');

        // Find the professional by ID and update their details
        const professional = await Professional.findByPk(professionalId);
        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        // Update the professional's details
        await professional.update({
            phoneNumber,
            fname,
            lname,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability,
            professions: subProfessions,
            workAreas,
            languages,
            location,
        });

        res.status(200).json({ message: 'Professional updated successfully', data: professional });
    } catch (error) {
        console.error('Error updating professional:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const sendSms = async (phoneNumber, message) => {
    try {
        const url = `https://sms.innovio.co.il/sms.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const response = await axios.get(url);
        if (response.status === 200) {
            console.log('SMS sent successfully');
        } else {
            console.error('Failed to send SMS:', response);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

// Function to generate a random verification code
function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit code
}

// API Endpoint to Generate Verification Code
const generateVerificationCodeHandler = async (req, res) => {
    const { phoneNumber, message } = req.body;
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Set expiry time to 5 minutes

    try {
        // Upsert to avoid duplicates for the same phone number
        await PhoneVerification.upsert({
            phoneNumber,
            code,
            expiresAt,
        });

        // Insert the generated code into the translated message and send via SMS
        const translatedMessage = message.replace("{code}", code);
        sendSms(phoneNumber, translatedMessage);

        res.status(200).json({ success: true, message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error storing verification code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// API Endpoint to Verify the Code

const verifyCodeHandler = async (req, res) => {
    const { phoneNumber, code } = req.body;

    try {
        const professional = await Professional.findOne({ where: { phoneNumber } });
        const isRegistered = !!professional;

        const verificationRecord = await PhoneVerification.findOne({ where: { phoneNumber } });

        if (!verificationRecord) {
            return res.status(401).json({ success: false, data: { registered: isRegistered } });
        }

        const { code: storedCode, expiresAt } = verificationRecord;

        if (new Date() > expiresAt || storedCode !== code) {
            return res.status(401).json({ success: false, data: { registered: isRegistered } });
        }

        // If the professional is registered, grant auth tokens
        if (isRegistered) {
           await grantProfAuth(professional, res);

            return res.status(200).json({
                success: true,
                data: {
                    profId: professional.id,
                    registered: true,
                },
                message: 'Verification successful',
            });
        }

        // Send to registration if not registered
        res.status(200).json({
            success: true,
            data: { phoneNumber, registered: false },
            message: 'Verification successful, but professional not registered',
        });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ success: false });
    }
};


const downloadVCardHandler = async (req, res) => {
    const { id } = req.params;

    try {
        // Find professional data by ID
        const professional = await Professional.findByPk(id);
        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        // Construct the vCard with CHARSET=UTF-8 directly in each line
        const vCardData = `
BEGIN:VCARD
VERSION:3.0
N;CHARSET=UTF-8:${professional.lname || ''};${professional.fname || ''}
FN;CHARSET=UTF-8:${professional.fname || ''} ${professional.lname || ''}
ORG;CHARSET=UTF-8:${professional.businessName || ''}
TEL;TYPE=WORK,VOICE:${professional.phoneNumber || ''}
EMAIL:${professional.email || ''}
URL:${professional.website || ''}
ADR;TYPE=WORK;CHARSET=UTF-8:;;${professional.location?.address || ''}
END:VCARD
        `;

        // Encode filename for Content-Disposition
        const filename = `${professional.fname || 'contact'}_${professional.lname || ''}.vcf`;
        const encodedFilename = encodeURIComponent(filename);

        // Set headers to prompt download in the browser with UTF-8 encoding
        res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');

        // Send the vCard data as a UTF-8 buffer
        res.status(200).send(Buffer.from(vCardData, 'utf-8'));
    } catch (error) {
        console.error('Error generating vCard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const addProfessionalToChannel = async (req, res) => {
    const { userId, requestId } = req.body;
    console.log("Received professionalId:", userId);
    console.log("Received requestId:", requestId);
    const streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    const channelId = `request_${requestId}`;
  
    try {
      // Check if the professional exists
      const professionalExists = await streamClient.queryUsers({ id: userId });
      if (professionalExists.users.length === 0) {
        await streamClient.upsertUser({
          id: userId,
          name: `Professional ${userId}`, // Customize as needed
        });
      }
  
      // Add professional to the channel
      const channel = streamClient.channel("messaging", channelId);
      await channel.addMembers([userId]);
  
      res.status(200).json({
        success: true,
        message: `Professional ${userId} added to channel ${channelId}`,
      });
    } catch (error) {
      console.error("Error adding professional to channel:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  const getProfessionalRequestDetails = async (req, res) => {
    const { requestId } = req.params; // Extract request ID from params

    try {
        // Fetch the request details
        const request = await Request.findByPk(requestId);

        if (!request) {
            return res
                .status(404)
                .json({ success: false, message: "Request not found" });
        }

        // Respond with the request details
        res.status(200).json({
            success: true,
            data: {
                id: request.id,
                jobRequiredId: request.jobRequiredId,
                city: request.city,
                date: request.date,
                comment: request.comment,
                status: request.status,
            },
        });
    } catch (error) {
        console.error("Error fetching request details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const fetchNewRequests = async (req, res) => {
    try {
        console.log("Step 1: Entered fetchNewRequests function"); // Check if the function is called

        const professionalId = req.professional.profId; // Extract from the decoded JWT
        console.log("Step 2: Extracted professionalId from req.professional:", professionalId);

        const professional = await Professional.findByPk(professionalId);
        console.log("Step 3: Fetched professional from the database:", professional);

        if (!professional) {
            console.log("Step 4: Professional not found for ID:", professionalId);
            return res.status(404).json({ success: false, message: 'Professional not found' });
        }

        console.log("Step 5: Professional found. Professions array:", professional.professions);

        // Fetch matching requests
        const matchingRequests = await Request.findAll({
            where: {
              jobRequiredId: { [Op.in]: professional.professions }, // Check against profession IDs
              professionalId: null, // Only unclaimed requests
              status: 'new', // Only new requests
            },
          });

        console.log("Step 6: Matching requests fetched from the database:", matchingRequests);

        res.status(200).json({ success: true, data: matchingRequests });
    } catch (error) {
        console.error("Step 7: Error occurred in fetchNewRequests:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const assignRequestToProfessional = async (req, res) => {
    const { requestId } = req.body;
    const professionalId = req.professional.profId; // Extract from the decoded JWT

    try {
        const request = await Request.findByPk(requestId);

        if (!request || request.status !== 'new') {
            return res.status(400).json({ success: false, message: 'Request is not available' });
        }

        await request.update({ professionalId, status: 'in-process' });

        res.status(200).json({ success: true, message: 'Request assigned successfully', data: request });
    } catch (error) {
        console.error('Error assigning request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const fetchProfessionalRequests = async (req, res) => {
    const professionalId = req.professional.profId; // Extract from the decoded JWT

    try {
        const requests = await Request.findAll({
            where: {
                professionalId,
            },
        });

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error('Error fetching professional requests:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




module.exports = {
    fetchNewRequests,
    checkIfRegistered,
    assignRequestToProfessional,
    getAllLocations,
    downloadVCardHandler,
    fetchProfessionalRequests,

    assignRequestToProfessional,
    addProfessionalToChannel,
    registerProfessional,getProfessionalById,updateProfessional,uploadImage
    ,generateVerificationCodeHandler
    ,verifyCodeHandler,createReportMissingProfession,getProfessionalRequestDetails
};
