//Import the mongoose module
const mongoose = require('mongoose');
const config = require('../config/config');

//Set up default mongoose connection
mongoose.connect(`mongodb://127.0.0.1/${config.database}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = { mongoose };
