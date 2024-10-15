// models/professional.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a sequelize instance here

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
}, {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
});

module.exports = Professional;
