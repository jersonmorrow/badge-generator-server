const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// setttings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

// Middlewares

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use('/uploads', express.static('uploads'));
app.use(logger('dev'));
app.use(cookieParser());

// Set up Mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log('MongoDB connection stablished');
  }
);

// routes
app.use('/users', require('./routes/userRouter'));
app.use('/events', require('./routes/eventRouter'));
app.use('/badges', require('./routes/badgeRouter'));
