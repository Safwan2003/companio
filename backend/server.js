const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const bodyParser = require('body-parser');
const Message = require('./models/message'); // Add this line to import the Message model

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const users = {}; // Map to store user IDs and their corresponding socket IDs


// Server-side code
// Server-side code
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on('user_connected', (userId) => {
    console.log(`User ${userId} connected`);
    users[userId] = socket.id;
    console.log('Users:', users);
  });

  socket.on('sendmessage', ({ recipientId, message }) => {
    const recipientSocket = users[recipientId];
    console.log('Recipient ID:', recipientId);
    console.log('Recipient Socket:', recipientSocket);

    if (recipientSocket) {
      io.to(recipientSocket).emit('private message', { senderId: socket.id, message });
      console.log("recipient\t"+recipientSocket+'\nSender\t'+socket.id+"\nmessage\t"+message)
    } else {
      console.log('Recipient not found');
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Remove the user from the users object upon disconnection
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log('Users:', users);
  });
});


app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/', require('./routes/task'));
app.use('/api/', require('./routes/getuser'));
app.use('/api/', require('./routes/attendance'));
app.use('/api/singlechat', require('./routes/singleChatRoutes'));

const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

dbconnect();
