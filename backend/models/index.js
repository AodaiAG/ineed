const sequelize = require('../config/db'); // Your Sequelize instance
const Client = require('./client/Client'); // Import models
const Request = require('./client/Request');
const ClientRequest = require('./client/ClientRequest');
const Cancellation = require('./Cancellation');
const Professional = require("./professional"); // Import Professional model
const ProfessionalRating = require("./ProfessionalRating"); // Import Professio
// Define associations
Client.hasMany(ClientRequest, { foreignKey: 'clientId', as: 'clientRequests' });
ClientRequest.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Request.hasMany(ClientRequest, { foreignKey: 'requestId', as: 'clientRequests' });
ClientRequest.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });

Professional.hasMany(ProfessionalRating, { foreignKey: "professionalId", as: "professionalRatings" }); // ✅ Unique alias
Client.hasMany(ProfessionalRating, { foreignKey: "clientId", as: "clientRatingProf" }); // ✅ Unique alias
Request.hasOne(ProfessionalRating, { foreignKey: "requestId", as: "requestRating" }); // ✅ Unique alias

ProfessionalRating.belongsTo(Professional, { foreignKey: "professionalId", as: "professional" }); // ✅ Unique alias
ProfessionalRating.belongsTo(Client, { foreignKey: "clientId", as: "client" }); // ✅ Unique alias
ProfessionalRating.belongsTo(Request, { foreignKey: "requestId", as: "request" }); // ✅ Unique alias


// Export all models
module.exports = {
    sequelize,
    Client,
    Request,
    ClientRequest,
    Cancellation,
    ProfessionalRating,
};
