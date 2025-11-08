import { Router } from "express";
import { testEmail } from "../controllers/email.controller";

const router = Router();

router.post("/send", testEmail);

export default router;
