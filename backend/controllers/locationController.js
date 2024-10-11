const axios = require('axios');

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ;

// Get address from lat/lon (Reverse geocoding)
exports.getGeocode = async (req, res) => {
    const { lat, lon } = req.query;  // Get lat and lon from query parameters
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                latlng: `${lat},${lon}`,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        if (response.data.results.length > 0) {
            res.json(response.data.results[0].formatted_address);  // Send the formatted address
        } else {
            res.status(404).json({ error: 'Address not found' });
        }
    } catch (error) {
        console.error('Failed to fetch address:', error);
        res.status(500).json({ error: 'Failed to fetch address' });
    }
};

// Get autocomplete suggestions for an address
exports.getAutocomplete = async (req, res) => {
    const { input } = req.query;  // Get input from query parameters
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        res.json(response.data.predictions);  // Send autocomplete suggestions to frontend
    } catch (error) {
        console.error('Failed to fetch autocomplete suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch autocomplete suggestions' });
    }
};
