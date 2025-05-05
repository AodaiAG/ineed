const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cancellation = sequelize.define(
    "Cancellation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
        cancelledId: {
            type: DataTypes.STRING, // ID of the person who canceled (string)
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cancelledBy: {
            type: DataTypes.ENUM("client", "professional", "admin"),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "Cancellations",
    }
);

module.exports = Cancellation;
