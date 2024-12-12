const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  recipientId: {
    type: DataTypes.STRING, // To support both UUID and integer IDs
    allowNull: false,
  },
  recipientType: {
    type: DataTypes.ENUM('client', 'professional'),
    allowNull: false,
  },
  messageKey: {
    type: DataTypes.STRING, // For translation keys
    allowNull: false,
  },
  requestId: {
    type: DataTypes.INTEGER, // Optional, for context-specific actions
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING, // URL or route path
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'Notifications',
});

module.exports = Notification;
