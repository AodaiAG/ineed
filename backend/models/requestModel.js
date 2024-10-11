const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the Request model
const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    create_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    job_type: {
        type: DataTypes.INTEGER,
        //defaultValue: 'default_value',
        references: {
            model: 'job_type',
            key: 'id'
        }
    },

        main_type: { // New field
            type: DataTypes.TEXT
        },
        sub_type: { // New field
            type: DataTypes.TEXT
        },

    job_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_timestamp: {
        type: DataTypes.DATE
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_phone: { // New field for client phone number
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sms_verification: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    job_agent: {
        type: DataTypes.INTEGER,
        //defaultValue: 'default_value',
        references: {
            model: 'agents',
            key: 'id'
        }
    },
    job_finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    job_price: {
        type: DataTypes.FLOAT
    },
    job_image: {
        type: DataTypes.STRING
    },
    job_rate: {
        type: DataTypes.INTEGER
    },


    customer_description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'request',
    timestamps: false
});

module.exports = Request;
