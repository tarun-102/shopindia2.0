const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
   console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error(err);
  }
};

module.exports = connectToDatabase;