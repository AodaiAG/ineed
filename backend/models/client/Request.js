const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Professional = require('../professional');

// Import JobType model (dynamic table name should be handled in initialization)
const JobType = require('../jobTypeModel')

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jobRequiredId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Required field
        
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('new', 'in-process', 'closed'),
        defaultValue: 'new', // Default status is 'new'
    },
    professionalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Professional, // Reference the Professional model
            key: 'id', // The id field in Professional
        },
        allowNull: true, // Null if no professional has taken the request yet
    },
}, {
    timestamps: true,
    tableName: 'Requests', // Explicit table name
});

module.exports = Request;
