const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generate a unique ID
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures no duplicate phone numbers
        validate: {
            is: /^[0-9]+$/, // Only allow numeric values
            len: [10, 15], // Adjust length as needed
        },
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for now
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'Clients', // Explicit table name
});

module.exports = Client;
