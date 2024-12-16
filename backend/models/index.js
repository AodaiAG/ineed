const sequelize = require('../config/db'); // Your Sequelize instance
const Client = require('./client/Client'); // Import models
const Request = require('./client/Request');
const ClientRequest = require('./client/ClientRequest');
const Cancellation = require('./Cancellation');
// Define associations
Client.hasMany(ClientRequest, { foreignKey: 'clientId', as: 'clientRequests' });
ClientRequest.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Request.hasMany(ClientRequest, { foreignKey: 'requestId', as: 'clientRequests' });
ClientRequest.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });



// Export all models
module.exports = {
    sequelize,
    Client,
    Request,
    ClientRequest,
    Cancellation
};
