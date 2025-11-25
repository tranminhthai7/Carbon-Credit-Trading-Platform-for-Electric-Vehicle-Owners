import { Router } from "express";
import {
  getAdminStats,
  getAdminHealth,
  getAdminActivities,
  getAdminUsers,
  getAdminTransactions
} from "../controllers/admin.controller";

const router = Router();

router.get("/stats", getAdminStats);
router.get("/health", getAdminHealth);
router.get("/activities", getAdminActivities);
router.get("/users", getAdminUsers);
router.get("/transactions", getAdminTransactions);

export default router;