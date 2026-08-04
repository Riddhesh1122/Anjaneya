const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('bufferCommands', false);
  if (!process.env.MONGO_URI) {
    console.log('ℹ️ MONGO_URI not set. Running in offline/mock mode.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
  }
};

module.exports = connectDB;
