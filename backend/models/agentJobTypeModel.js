const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the AgentJobType model
const AgentJobType = sequelize.define('AgentJobType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    agent: {
        type: DataTypes.INTEGER,
        references: {
            model: 'agents',
            key: 'id'
        }
    },
    job_type: {
        type: DataTypes.INTEGER,
        references: {
            model: 'job_type',
            key: 'id'
        }
    }
}, {
    tableName: 'agent_job_type',
    timestamps: false
});

module.exports = AgentJobType;
