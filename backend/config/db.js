const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure to install dotenv by running `npm install dotenv`


// Sequelize instance connecting to MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,       // Database name
    process.env.DB_USER,       // Database username
    process.env.DB_PASSWORD,   // Database password
    {
        host: process.env.DB_HOST || 'localhost', // Default to localhost
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,        // Default to port 3306
        logging: console.log                      // Log SQL queries for debugging
    }
);


// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the local database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the local database:', err);
    });

module.exports = sequelize;
