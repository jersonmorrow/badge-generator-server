// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// Environment Variables
const { config } = require('./config/index');

// setttings
app.listen(config.port, () =>
  console.log(`Server runing on port ${config.port}`)
);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: `${config.clientUrl}`,
    credentials: true,
  })
);
app.use('/uploads', express.static('uploads'));
app.use(logger('dev'));
app.use(cookieParser());

// Mongoose
mongoose.connect(
  config.dbConnection,
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
