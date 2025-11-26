import { Router } from "express";
import { getSystemSettings, updateSystemSettings } from "../controllers/settings.controller";

const router = Router();

// GET /settings - Get system settings
router.get("/", getSystemSettings);

// PUT /settings - Update system settings
router.put("/", updateSystemSettings);

export default router;