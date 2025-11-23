import { Router } from "express";
import {
  getPersonalReport,
  getCo2Savings,
  getRevenueReport,
  getPlatformAnalytics,
  createPersonalReportFromTrip
} from "../controllers/report.controller";

const router = Router();

router.get("/personal/:userId", getPersonalReport);
router.get("/co2-savings/:userId", getCo2Savings);
router.get("/revenue/:userId", getRevenueReport);
router.get("/platform", getPlatformAnalytics);

// helper (POST) để tạo báo cáo từ file/giả lập hành trình
router.post("/personal/from-trips", createPersonalReportFromTrip);

export default router;
