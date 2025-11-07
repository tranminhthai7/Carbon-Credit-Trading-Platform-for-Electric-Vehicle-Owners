import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import reportRoutes from "./routes/report.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/reports", reportRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/reporting-service")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`✅ Reporting Service is running on port ${PORT}`);
});
