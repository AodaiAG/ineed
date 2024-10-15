// professionalController.js
const Professional = require('../models/professional');

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


module.exports = {
    checkIfRegistered,
};
