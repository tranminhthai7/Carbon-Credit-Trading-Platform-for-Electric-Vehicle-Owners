import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/reporting-service");
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};
