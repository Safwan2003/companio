const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors()); 




app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/', require('./routes/task'));


const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit process with failure
  }
};

dbconnect();
