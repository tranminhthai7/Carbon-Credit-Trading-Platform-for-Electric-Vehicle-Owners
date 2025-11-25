import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import reportRoutes from "./routes/report.routes";
import adminRoutes from "./routes/admin.routes";
import { connectDB } from "./config/database";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);
app.use("/admin", adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'reporting-service'
  });
});

const PORT = Number(process.env.PORT || 3008);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Reporting service running on port ${PORT}`);
  });
});
