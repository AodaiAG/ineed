const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const professional = require('./professional'); // Assuming Professional model exists

// Define the RefreshToken model
const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    professionalId: {
        type: DataTypes.INTEGER,
        references: {
            model: professional,
            key: 'id', // Assuming 'id' is the primary key in Professional model
        },
        allowNull: false,
        onDelete: 'CASCADE', // Deletes token if professional is deleted
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'RefreshTokens',
    timestamps: false, // No createdAt or updatedAt columns
});

module.exports = RefreshToken;
