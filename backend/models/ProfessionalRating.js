// models/professional/ProfessionalRating.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import Sequelize instance
const Professional = require("./professional"); // Import Professional model
const Client = require("./client/Client"); // Import Client model
const Request = require("./client/Request"); // Import Request model

const ProfessionalRating = sequelize.define(
  "ProfessionalRating",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
        type: DataTypes.UUID, // ✅ FIX: Match Client's ID type
        allowNull: false,
        references: {
          model: Client,
          key: "id",
        },
    },
    professionalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Professional, // Professional who is being rated
        key: "id",
      },
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Request, // Request ID that the rating is related to
        key: "id",
      },
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }, // Rating scale 1-5
    },
    professionalism: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT, // Optional client feedback
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields
    tableName: "ProfessionalRatings",
  }
);

// Establish relationships
Professional.hasMany(ProfessionalRating, { foreignKey: "professionalId", as: "ratings" });
Client.hasMany(ProfessionalRating, { foreignKey: "clientId", as: "clientRatings" });
Request.hasOne(ProfessionalRating, { foreignKey: "requestId", as: "rating" });

ProfessionalRating.belongsTo(Professional, { foreignKey: "professionalId" });
ProfessionalRating.belongsTo(Client, { foreignKey: "clientId" });
ProfessionalRating.belongsTo(Request, { foreignKey: "requestId" });

module.exports = ProfessionalRating;
