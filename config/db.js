const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
   await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB connected on ${MONGO_URI}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
