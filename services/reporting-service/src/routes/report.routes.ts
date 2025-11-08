import express from "express";
import {
  getPersonalReport,
  getCo2Savings,
  getRevenueReport,
  getPlatformAnalytics
} from "../controllers/report.controller";

const router = express.Router();

router.get("/personal/:userId", getPersonalReport);
router.get("/co2-savings/:userId", getCo2Savings);
router.get("/revenue/:userId", getRevenueReport);
router.get("/platform", getPlatformAnalytics);

export default router;
