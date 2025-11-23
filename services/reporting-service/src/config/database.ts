import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carbon_marketplace";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Reporting service connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
