const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const RefreshTokenClient = require('../models/client/RefreshTokenClient');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../utils/constants');

const refreshAccessToken = async (refreshToken) => {
    console.log('Received request to refresh access token');

    if (!refreshToken) {
        throw new Error('Refresh token required'); // Explicitly throw an error if no refresh token is provided
    }

    try {
        // Verify if the refresh token is stored in the database
        const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!storedToken) {
            throw new Error('Invalid refresh token'); // Throw an error if token is not found in the database
        }

        // Verify the refresh token itself
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        
        const { profId } = decoded;
        const newAccessToken = jwt.sign({ profId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        
        return newAccessToken; // Return the new access token
    } catch (error) {
        console.error('Error in refreshAccessToken function:', error.message);
        throw error; // Propagate the error to be handled in authenticateToken
    }
};
const refreshClientAccessToken = async (refreshToken) => {
    console.log('Received request to refresh access token');

    if (!refreshToken) {
        throw new Error('Refresh token required'); // Explicitly throw an error if no refresh token is provided
    }

    try {
        // Verify if the refresh token is stored in the database
        const storedToken = await RefreshTokenClient.findOne({ where: { token: refreshToken } });
        if (!storedToken) {
            throw new Error('Invalid refresh token'); // Throw an error if token is not found in the database
        }

        // Verify the refresh token itself
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        
        const { clientId } = decoded;
        const newAccessToken = jwt.sign({ clientId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        
        return newAccessToken; // Return the new access token
    } catch (error) {
        console.error('Error in refreshAccessToken function:', error.message);
        throw error; // Propagate the error to be handled in authenticateToken
    }
};


const grantClientAuth = async (client, res) => {
    const accessToken = jwt.sign({ clientId: client.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ clientId: client.id }, REFRESH_TOKEN_SECRET, { expiresIn: '90d' });

    await RefreshTokenClient.create({
        token: refreshToken,
        clientId: client.id,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    res.setHeader('x-access-token', accessToken);
    res.setHeader('x-refresh-token', refreshToken);

    return { accessToken, refreshToken };
};

const verifyClientAuth = async (req, res) => {
    res.status(200).json({
        isValidUserdata: true,
        decryptedUserdata: { ...req.user },
    });
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
const grantProfAuth = async (professional, res) => {
    const accessToken = jwt.sign({ profId: professional.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ profId: professional.id }, REFRESH_TOKEN_SECRET, { expiresIn: '90d' });

    await RefreshToken.create({
        token: refreshToken,
        professionalId: professional.id,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });


    res.setHeader('x-access-token', accessToken);
    res.setHeader('x-refresh-token', refreshToken);

    return { accessToken, refreshToken };
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
    logout,verifyAuth,grantProfAuth,grantClientAuth, verifyClientAuth,refreshClientAccessToken
};
