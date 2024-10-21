// professionalController.js
const Professional = require('../models/professional');
const Location = require('../models/Location'); // Import the Location model

const checkIfRegistered = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Find a professional with the given phone number
        const professional = await Professional.findOne({ where: { phoneNumber } });

        if (professional) {
            return res.status(200).json({ registered: true });
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
        professions, // Array of profession IDs (includes both main and sub professions)
        workAreas, // Array of city IDs directly from the frontend
        languages
    } = req.body;

    try {
        // Split the full name into first name and last name (assuming space separates them)
        const [fname, ...lnameParts] = fullName.split(' ');
        const lname = lnameParts.join(' ');

        // Create a new professional record in the database
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
            professions, // Save the array of selected profession IDs
            workAreas,   // Save the array of city IDs directly
            languages
        });

        res.status(201).json({ message: 'Professional registered successfully', data: newProfessional, id: newProfessional.id });
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
        languages
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
            languages
        });

        res.status(200).json({ message: 'Professional updated successfully', data: professional });
    } catch (error) {
        console.error('Error updating professional:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    checkIfRegistered,
    getAllLocations,
    registerProfessional,getProfessionalById,updateProfessional 
};
