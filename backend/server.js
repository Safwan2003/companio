const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const bodyParser = require('body-parser');
const Message = require('./models/message'); // Add this line to import the Message model
const OpenAI = require('openai');


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 5000, // Optional timeout in milliseconds
});


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

  socket.on('user_connected', ({userId,room}) => {
    console.log(`User ${userId} connected`);
    socket.join(room)
    users[userId] = socket.id;
    console.log('Users:', users);
  });

  socket.on('sendmessage', ({room, recipientId, message, senderId }) => {

    const senderSocket = users[senderId];
    const recipientSocket = users[recipientId];
    console.log('Recipient ID:', recipientId);
    console.log('Recipient Socket:', recipientSocket);
    console.log('sender ID:', senderId);
    console.log('sender Socket:', senderSocket);
    console.log('Room:', room);

    if (recipientSocket) {
      // io.to(room).emit('private message', { senderSocket, message });
      io.to(recipientSocket).emit('private message', { senderId, message }); // Send message only to the recipient's socket

      console.log("recipient\t"+recipientSocket+'\nSender\t'+senderSocket+"\nmessage\t"+message+"\n room\t"+room);
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










app.post('/aibot', async (req, res) => {
  try {
    // Extract the message from the request body
    const message = req.body.message;

    // Process the message using OpenAI GPT-3
    const botResponse = await generateBotResponse(message);

    // Send the bot response back to the client
    res.json({ message: botResponse });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to generate a response from the bot using OpenAI GPT-3
async function generateBotResponse(message) {
  try {
    // Use the OpenAI API to generate a response
    const response = await openai.complete({
      engine: 'text-davinci-002', // Specify the GPT-3 engine
      prompt: message,
      maxTokens: 50 // Maximum number of tokens for the response
    });

    // Extract the generated response from the API response
    const botResponse = response.data.choices[0].text.trim();

    return botResponse;
  } catch (error) {
    console.error('Error generating bot response:', error);
    return 'Sorry, I could not process your message at the moment.';
  }
}








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
