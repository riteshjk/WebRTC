const dotenv = require('dotenv').config();

const express = require('express');
const otpRouter = require("./routes/auth.routes");
const DbConnect = require('./database');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const ACTIONS = require('./actions');
const server = require('http').createServer(app);

app.use(cookieParser());

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONT_URL,
        methods: ['GET', 'POST'],
    },
});


const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

// to show the image properly when we have routes like /storage so show the image which is stored in it we use this
app.use('/storage', express.static('storage'));
app.use(express.json({limit: '10mb'}));
app.use('/api/v1', otpRouter);

const PORT = process.env.PORT || 5500;
DbConnect();
app.get('/', (req, res) => {
    res.send('Hello World');
});



// Sockets

const socketUserMap = {};


io.on('connection', (socket) => {
    console.log('New connection', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMap[socket.id] = user;
        
        // new array
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user,
            });
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMap[clientId],
            });
        });
        socket.join(roomId);
    });

    // Handle relay Ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });

    
    // Handle realy sdp (session description)
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });


    // socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    //     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    //     clients.forEach((clientId) => {
    //         io.to(clientId).emit(ACTIONS.MUTE, {
    //             peerId: socket.id,
    //             userId,
    //         });
    //     });
    // });

    // socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    //     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    //     clients.forEach((clientId) => {
    //         io.to(clientId).emit(ACTIONS.UNMUTE, {
    //             peerId: socket.id,
    //             userId,
    //         });
    //     });
    // });

    // socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
    //     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    //     clients.forEach((clientId) => {
    //         if (clientId !== socket.id) {
    //             console.log('mute info');
    //             io.to(clientId).emit(ACTIONS.MUTE_INFO, {
    //                 userId,
    //                 isMute,
    //             });
    //         }
    //     });
    // });

    // Leaving the room

    const leaveRoom = () => {
        const { rooms } = socket;

        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMap[socket.id]?.id,
                });

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMap[clientId]?.id,
                });
            });
            socket.leave(roomId);
        });
        delete socketUserMap[socket.id];
    };

     socket.on(ACTIONS.LEAVE, leaveRoom);

     socket.on('disconnecting', leaveRoom);
});
server.listen(PORT, async() => console.log(`Listening on port ${PORT}`));