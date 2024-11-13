const jwt = require('jsonwebtoken');
const axios = require('axios');
const API_URL =  'http://localhost:3001';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');


const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        if (!refreshToken) {
            return res.status(401).json({ message: 'Access token and refresh token required' });
        }

        // Attempt to refresh the access token
        try {
            const refreshResponse = await axios.get(`${API_URL}/auth/refresh-token`, {
                headers: { Cookie: `refreshToken=${refreshToken}` },
                withCredentials: true,
            });

            if (refreshResponse.status === 200) {
                const newAccessToken = refreshResponse.data.accessToken;
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 15 * 60 * 1000,
                });
                req.professional = jwt.verify(newAccessToken,ACCESS_TOKEN_SECRET);
                next();
            } else {
                return res.status(401).json({ message: 'Failed to refresh token' });
            }
        } catch (error) {
            // Send 403 if the refresh token is expired
            if (error.response && error.response.status === 403) {
                return res.status(403).json({ message: 'Refresh token expired' });
            }
            return res.status(401).json({ message: 'Unable to refresh token, please log in again' });
        }
    } else {
        // Verify the access token if it exists
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid access token' });
            } else {
                req.professional = decoded;
                next();
            }
        });
    }
};



module.exports = authenticateToken;
