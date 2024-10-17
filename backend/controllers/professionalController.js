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
        const locations = await Location.findAll();
        console.log('Fetched locations:', locations);

        // Group locations by Area_Name
        const groupedLocations = locations.reduce((acc, location) => {
            const { Area_Name, City_Name } = location;
            if (!acc[Area_Name]) {
                acc[Area_Name] = [];
            }
            acc[Area_Name].push(City_Name);
            return acc;
        }, {});

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
        workAreas,
        languages
    } = req.body;

    try {
        // Split the full name into first name and last name (assuming space separates them)
        const [fname, ...lnameParts] = fullName.split(' ');
        const lname = lnameParts.join(' ');

        // Flatten workAreas to get an array of city names
        const cityNames = Object.values(workAreas).flat();

        // Fetch the city IDs based on the provided workAreas
        const cityIds = await Location.findAll({
            where: {
                City_Name: cityNames
            },
            attributes: ['City_ID']
        });

        // Extract the city IDs
        const workAreaIds = cityIds.map((location) => location.City_ID);

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
            workAreas: workAreaIds,
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




module.exports = {
    checkIfRegistered,
    getAllLocations,
    registerProfessional,getProfessionalById,
};
