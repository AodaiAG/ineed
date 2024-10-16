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


module.exports = {
    checkIfRegistered,
    getAllLocations,
};
