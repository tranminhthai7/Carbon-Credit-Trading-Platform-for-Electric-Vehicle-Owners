import { Router } from "express";
import {
  getRevenueAnalytics,
  getUserAnalytics,
  getCarbonAnalytics
} from "../controllers/analytics.controller";

const router = Router();

// Analytics routes
router.get("/revenue", getRevenueAnalytics);
router.get("/users", getUserAnalytics);
router.get("/carbon", getCarbonAnalytics);

export default router;