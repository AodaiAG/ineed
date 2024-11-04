// models/ReportMissingProfession.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReportMissingProfession = sequelize.define('ReportMissingProfession', {
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isMissing: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  mainProfession: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  additionalSubProfession: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'report_missing_professions', // Name of the table in the database
  timestamps: false,
});

module.exports = ReportMissingProfession;
