const jwt = require('jsonwebtoken');
const RefreshTokenClient = require('../models/client/RefreshTokenClient');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');

const authenticateClientToken = async (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    try {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        if (!decoded.clientId) {
            return res.status(403).json({ message: 'Invalid client token' });
        }

        req.user = decoded; // Attach decoded user data
        next(); // Proceed to the next middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is required' });
            }

            try {
                const storedToken = await RefreshTokenClient.findOne({ where: { token: refreshToken } });
                if (!storedToken) throw new Error('Invalid refresh token');

                const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
                const newAccessToken = jwt.sign({ clientId: decodedRefresh.clientId }, ACCESS_TOKEN_SECRET, {
                    expiresIn: '15m',
                });

                res.setHeader('x-access-token', newAccessToken);
                req.user = jwt.verify(newAccessToken, ACCESS_TOKEN_SECRET);
                next();
            } catch (refreshError) {
                console.error('Refresh token error:', refreshError.message);
                return res.status(403).json({ message: 'Could not refresh token, please log in again' });
            }
        } else {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }
    }
};

module.exports = authenticateClientToken;
