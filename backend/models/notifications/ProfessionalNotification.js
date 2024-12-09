const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./client/Request');

const ProfessionalNotification = sequelize.define('ProfessionalNotification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    professionalId: {
        type: DataTypes.INTEGER, // Integer for the professional ID
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
    tableName: 'ProfessionalNotifications',
});

module.exports = ProfessionalNotification;
