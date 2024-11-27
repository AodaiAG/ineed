const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Client = require('./Client');
const Request = require('./Request');

const ClientRequest = sequelize.define('ClientRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Generate a unique ID
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.UUID,
        references: {
            model: Client,
            key: 'id',
        },
        allowNull: false,
    },
    requestId: {
        type: DataTypes.INTEGER,
        references: {
            model: Request,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'ClientRequests', // Explicit table name
});

module.exports = ClientRequest;
