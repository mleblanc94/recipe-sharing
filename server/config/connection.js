require('dotenv').config();

// Import Mongoose
const mongoose = require('mongoose');

// Connect to mongodb database 'recipesharing' - if it doesn't exist, it will create it
const mongoDBUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipesharing';
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Export Connection
module.exports = mongoose.connection; 