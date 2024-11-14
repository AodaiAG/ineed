const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');
const refreshAccessToken = require('../controllers/authController').refreshAccessToken;

const authenticateToken = async (req, res, next) => {
    let accessToken = req.headers['x-access-token'];
    const refreshToken = req.headers['x-refresh-token'];

    console.log("Received Access Token:", accessToken);
    console.log("Received Refresh Token:", refreshToken);

    if (!accessToken) {
        console.log("No access token provided. Checking refresh token...");

        // No access token, try to refresh
        if (refreshToken) {
            try {
                console.log("Attempting to refresh access token using refresh token...");

                // Call the refreshAccessToken function directly
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    console.log("New Access Token generated:", newAccessToken);

                    // Set the refreshed access token in headers for further checks
                    req.headers['x-access-token'] = newAccessToken; 
                    accessToken = newAccessToken;
                } else {
                    console.warn("Refresh token found but unable to generate new access token.");
                    return res.status(403).json({ message: 'Could not refresh token, please log in again' });
                }
            } catch (error) {
                console.error("Error while refreshing access token:", error);
                return res.status(403).json({ message: 'Could not refresh token, please log in again' });
            }
        } else {
            console.warn("No access or refresh token provided.");
            return res.status(401).json({ message: 'Access token required' });
        }
    }

    console.log("Verifying access token...");

    // Verify the (new) access token if present
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Access token verification failed:", err);
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }
        console.log("Access token verified. Decoded data:", decoded);

        req.professional = decoded; // Attach user data to the request object
        next();
    });
};


module.exports = authenticateToken;
