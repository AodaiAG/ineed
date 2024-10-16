const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the Location model
const Location = sequelize.define('Location', {
    City_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    City_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    City_Name_Eng: {
        type: DataTypes.STRING
    },
    Area_ID: {
        type: DataTypes.INTEGER
    },
    Area_Name: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Location',
    timestamps: false
});

module.exports = Location;