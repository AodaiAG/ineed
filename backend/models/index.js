const sequelize = require('../config/db'); // Your Sequelize instance
const Client = require('./client/Client'); // Import models
const Request = require('./client/Request');
const ClientRequest = require('./client/ClientRequest');
const Notification = require('./Notification'); // New Notification model

// Define associations
Client.hasMany(ClientRequest, { foreignKey: 'clientId', as: 'clientRequests' });
ClientRequest.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Request.hasMany(ClientRequest, { foreignKey: 'requestId', as: 'clientRequests' });
ClientRequest.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });

// Notification relationships
Client.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications', scope: { recipientType: 'client' } });
Notification.belongsTo(Client, { foreignKey: 'recipientId', as: 'client', scope: { recipientType: 'client' } });

Request.hasMany(Notification, { foreignKey: 'requestId', as: 'notifications' });
Notification.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });

// Export all models
module.exports = {
    sequelize,
    Client,
    Request,
    ClientRequest,
    Notification, // Export Notification model
};
