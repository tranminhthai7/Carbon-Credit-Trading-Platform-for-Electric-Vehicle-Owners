import { Request, Response } from "express";
import { emailQueue } from "../services/emailQueue.service";

export const testEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, message } = req.body;
    await emailQueue.add("sendEmail", { to, subject, message });
    res.status(200).json({ success: true, message: "Email added to queue!" });
  } catch (err: any) {
    console.error("❌ Queue error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
