const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');
const refreshAccessToken = require('../controllers/authController').refreshAccessToken;

const authenticateToken = async (req, res, next) => {
    let accessToken = req.headers['x-access-token'];
    const refreshToken = req.headers['x-refresh-token'];

    console.log("Received Access Token:", accessToken);
    console.log("Received Refresh Token:", refreshToken);

    // Helper function to verify the access token or attempt refresh if invalid/missing
    const verifyOrRefreshAccessToken = async (token) => {
        try {
            // Attempt to verify the current access token
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            console.log("Access token verified. Decoded data:", decoded);
            req.professional = decoded; // Attach decoded data to request
            next(); // Proceed to the next middleware
        } catch (error) {
            if (error.name === 'TokenExpiredError' || !token) {
                console.log("Access token missing or expired. Checking for refresh token...");

                if (refreshToken) {
                    try {
                        console.log("Attempting to refresh access token using refresh token...");

                        // Generate a new access token using the refresh token
                        const newAccessToken = await refreshAccessToken(refreshToken);

                        if (newAccessToken) {
                            console.log("New Access Token generated:", newAccessToken);

                            // Send the new access token to the client in response headers
                            res.setHeader('x-access-token', newAccessToken);
                            req.headers['x-access-token'] = newAccessToken; // Update for this request
                            
                            // Re-attempt verification with the new access token
                            const decoded = jwt.verify(newAccessToken, ACCESS_TOKEN_SECRET);
                            req.professional = decoded; // Attach decoded data to req
                            next(); // Proceed to the next middleware
                        } else {
                            console.warn("Refresh token found but unable to generate new access token.");
                            return res.status(403).json({ message: 'Could not refresh token, please log in again' });
                        }
                    } catch (refreshError) {
                        console.error("Error while refreshing access token:", refreshError.message);
                        return res.status(403).json({ message: 'Could not refresh token, please log in again' });
                    }
                } else {
                    console.warn("No refresh token provided.");
                    return res.status(401).json({ message: 'Access token required' });
                }
            } else {
                console.error("Access token verification failed:", error.message);
                return res.status(403).json({ message: 'Invalid or expired access token' });
            }
        }
    };

    // Call the helper function to verify or refresh the token as needed
    await verifyOrRefreshAccessToken(accessToken);
};

module.exports = authenticateToken;
