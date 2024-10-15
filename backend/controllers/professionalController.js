// professionalController.js
const Professional = require('../models/professional');

const verifyOrCreateProfessional = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Find a professional with the given phone number
        let professional = await Professional.findOne({ where: { phoneNumber } });

        if (!professional) {
            // If not found, create a new professional
            professional = await Professional.create({ phoneNumber });
            return res.status(201).json({ success: false, message: 'Professional created', professional });
        }

        // If found, respond with the existing professional
        return res.status(200).json({ success: true, message: 'Professional verified', professional });
    } catch (error) {
        console.error('Error verifying or creating professional:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports = {
    verifyOrCreateProfessional,
};
