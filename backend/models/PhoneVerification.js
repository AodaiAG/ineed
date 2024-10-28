const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PhoneVerification = sequelize.define('PhoneVerification', {
  phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
  },
  code: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
  },
}, {
  tableName: 'phone_verification', // Ensure a consistent and expected table name
  timestamps: false, // Disable createdAt and updatedAt fields if not needed
});

  module.exports = PhoneVerification;