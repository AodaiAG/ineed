const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the Agents model
const Agent = sequelize.define('Agent', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT
    },
    israel_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'agents',
    timestamps: false
});

module.exports = Agent;
