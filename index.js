const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// setttings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

// Middlewares

app.use(express.json());
app.use(cors());
