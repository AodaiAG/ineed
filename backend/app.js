const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Added path for serving static files
const sequelize = require('./config/db'); // Import Sequelize instance
const professionalRoutes = require('./routes/professionalRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes'); // Adjust the path
const cookieParser = require('cookie-parser');
const { initSocket } = require('./config/socket'); // Import initSocket
const http = require('http'); // For creating HTTP server

const app = express();
const PORT = 3001; // Fixed port

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server); // Pass the server to the Socket.IO initializer

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://i-need.co.il",
        "https://sms.innovio.co.il"
    ],
    credentials: true,
    exposedHeaders: ['x-access-token', 'x-refresh-token'], // Expose these headers
}));

// Routes setup
app.use('/api/professionals', professionalRoutes);
app.use('/auth', authRoutes);
app.use('/api', clientRoutes);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle any other routes and send the React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Sync the database models and start the server
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully.');
        server.listen(PORT, () => { // Use the server to listen
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error syncing the database:', err);
    });

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ success: false, message: 'An internal error occurred.' });
});
