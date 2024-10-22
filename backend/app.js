    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');  // Added path for serving static files
    const sequelize = require('./config/db'); // Import Sequelize instance
    const professionalRoutes = require('./routes/professionalRoutes');
    const cors = require('cors');
    const clientRoutes = require('./routes/clientRoutes'); // Adjust the path
    const app = express();
    const PORT = 3001; // Fixed port

    app.use(bodyParser.json());
    app.use(cors());
    app.use('/api/professionals', professionalRoutes);
    app.use('/api', clientRoutes);
    // Serve static files from the React app's build directory
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    //mainfest
    app.get('/dynamic-manifest', (req, res) => {
        // Get the custom start URL from the query parameter, fallback to default if not provided
        const dynamicStartUrl = req.query.start_url || '/pro/expert-main';
    
        const manifest = {
            "name": "I Need App",
            "short_name": "I Need",
            "description": "A platform for experts and professionals.",
            "start_url": dynamicStartUrl, // Use dynamic start URL from the query
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": "#000000",
            "icons": [
                {
                    "src": "/images/Prof/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/images/Prof/icon-512x512.png",
                    "sizes": "427x475",
                    "type": "image/png"
                }
            ]
        };
    
        res.json(manifest);
    });

    // Handle any other routes and send the React frontend
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });



    // Sync the database models and start the server
    sequelize.sync()
        .then(() => {
            console.log('Database synced successfully.');
            app.listen(PORT, () => {
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
