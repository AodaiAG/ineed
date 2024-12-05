const { Server } = require('socket.io');

let io;
const connectedUsers = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "https://i-need.co.il",
                "https://sms.innovio.co.il"
            ],
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('register', (userId) => {
            connectedUsers.set(userId, socket.id);
            console.log(`User registered: ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (const [userId, id] of connectedUsers.entries()) {
                if (id === socket.id) {
                    connectedUsers.delete(userId);
                }
            }
        });
    });
};

const sendNotification = (userId, message) => {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification', message);
    }
};

module.exports = { initSocket, sendNotification };
