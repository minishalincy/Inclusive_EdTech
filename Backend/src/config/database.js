const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "DB",
    });
    console.log("Database connection successful....");
  } catch (error) {
    console.log("Database connection error:", error.message);
    throw error;
  }
};

module.exports = { connectDB };
