// config/db.js
import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};
