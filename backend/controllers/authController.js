const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');

// Function to generate an access token


// Refresh Access Token Controller
const refreshAccessToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token required' });
    }

    try {
        // Verify the refresh token exists in the database
        const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

        if (!storedToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Verify the token is valid
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            if (!decoded || !decoded.profId) {
                return res.status(403).json({ message: 'Invalid decoded payload in refresh token' });
            }

            // Generate a new access token directly
            const accessToken = jwt.sign({ profId: decoded.profId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            if (!accessToken) {
                console.log('Access token generation failed'); // Log if token generation failed
            }

            // Set the new access token as an HTTP-only cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            // Include the new access token in the JSON response for the middleware
            res.status(200).json({ accessToken, message: 'Access token refreshed' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyAuth = async (req, res) => {
    // Access all decoded token data from `req.professional` set by `authenticateToken`
    const decodedData = req.professional;
   console.log(decodedData)
    res.status(200).json({
        isValidUserdata: true,
        decryptedUserdata: { ...decodedData }, // Spread all properties of the decoded payload
    });
};

// Logout Controller to Clear Cookies and Remove Refresh Token
const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        // Delete the refresh token from the database
        await RefreshToken.destroy({ where: { token: refreshToken } });

        // Clear access and refresh tokens from cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    refreshAccessToken,
    logout,verifyAuth
};
