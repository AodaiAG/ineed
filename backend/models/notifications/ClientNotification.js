const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./client/Request');

const ClientNotification = sequelize.define('ClientNotification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.UUID, // UUID for the client
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requestId: {
        type: DataTypes.INTEGER,
        references: {
            model: Request,
            key: 'id',
        },
        allowNull: true,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'ClientNotifications',
});

module.exports = ClientNotification;
