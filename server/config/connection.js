require('dotenv').config();
const mongoose = require('mongoose');

const mongoDBUri =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipesharing';

mongoose.set('strictQuery', true); // optional, quiets warnings

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // quick fail if URI is wrong
});

const db = mongoose.connection;

db.once('open', () => {
  const where = mongoDBUri.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'Local MongoDB';
  console.log(`✅ Connected to ${where}`);
});

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = db;
