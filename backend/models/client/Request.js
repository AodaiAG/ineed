const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Professional = require('../professional');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jobRequiredId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    quotations: {
        type: DataTypes.JSON, // Store an array of objects as JSON
        allowNull: true,
        defaultValue: [], // Initialize as an empty array
    },
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open',
    },
    professionalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Professional,
            key: 'id',
        },
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'Requests',
});

module.exports = Request;
