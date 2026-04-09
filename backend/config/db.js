const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('No MongoDB URI provided. Running with in-memory data.');
      return false;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Falling back to in-memory data store.');
    return false;
  }
};

module.exports = connectDB;
