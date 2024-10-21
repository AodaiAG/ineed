const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the JobType model
const JobType = (tableName) => sequelize.define('JobType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    main: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sub: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName, // Dynamically set table name
    timestamps: false
});

module.exports = JobType;
