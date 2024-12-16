const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cancellation = sequelize.define(
    "Cancellation",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Requests",
                key: "id",
            },
        },
        profId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Professionals",
                key: "id",
            },
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "Cancellations",
    }
);

module.exports = Cancellation;
