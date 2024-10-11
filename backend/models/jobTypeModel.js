const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the JobType model
const JobType = sequelize.define('JobType', {
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
    tableName: 'job_type',
    timestamps: false
});

module.exports = JobType;
