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
    mainProfessions: {
        type: DataTypes.JSON,
    },
    subProfessions: {
        type: DataTypes.JSON,
    },
    workAreas: {
        type: DataTypes.JSON,
    },
}, {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
});

module.exports = Professional;