// models/professional.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a sequelize instance here

const Professional = sequelize.define('Professional', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
    },
    businessName: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.TEXT,
    },
    availability24_7: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    dayAvailability: {
        type: DataTypes.JSON,
    },
    professions: {
        type: DataTypes.JSON, // Store an array of profession IDs
    },
    workAreas: {
        type: DataTypes.JSON,
    },
    languages: {
        type: DataTypes.JSON, // Adding the languages field as JSON
    },
    location: {
        type: DataTypes.JSON, // Store address, latitude, and longitude as a JSON object
    },
    hasCompletedOnboarding: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
});

module.exports = Professional;