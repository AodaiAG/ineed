const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generate a unique ID
        primaryKey: true,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mainProfession: {
        type: DataTypes.STRING,
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
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'Requests', // Explicit table name
});

module.exports = Request;
