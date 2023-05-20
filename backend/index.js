const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')

const connectDB = require('./db/config')
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat')
const messageRoute = require('./routes/message')

const { Server } = require("socket.io");


dotenv.config();
connectDB();

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/message', messageRoute);

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    return res.send("Backend for chat-app application")
});

const server = app.listen(port, () => {
    console.log("Server listening on port", port);
});


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });

// listen for connection event
io.on('connection', (socket) => {
    console.log('Connection established between client and server through socket.io');
    
    socket.on("user_connected", (userId) => {
        if(userId)socket.join(userId);
    })
    
    
    socket.on("chatroom_joined", (chatId) => {
        console.log("An user has joined the chat with chatId:", chatId);
    })

    socket.on("message_sent", (message) => {
        if(!message)return;
        console.log(message);
        console.log("message recieved with id:", message._id);
        const users = message.chat.users;

        for(let user of users){
            if(user._id != message.sender._id){
                socket.in(user._id).emit("new_message", message);
            }
        }
        
    });
});