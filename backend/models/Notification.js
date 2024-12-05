const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is here
const Request = require('./client/Request');


const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    recipientType: {
        type: DataTypes.ENUM('client', 'professional'),
        allowNull: false,
    },
    recipientId: {
        type: DataTypes.UUID,
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
    tableName: 'Notifications',
});

module.exports = Notification;
