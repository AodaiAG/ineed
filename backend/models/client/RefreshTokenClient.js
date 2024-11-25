const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RefreshTokenClient = sequelize.define('RefreshTokenClient', {
    token: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    clientId: { 
        type: DataTypes.UUID, // Change to UUID to match the Client model
        allowNull: false,
        references: {
            model: 'Clients', // Ensure this matches the table name for Client
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: cascade deletion when a client is deleted
    },
    expiresAt: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
}, {
    timestamps: true,
    tableName: 'RefreshTokenClients',
});


module.exports = RefreshTokenClient;
