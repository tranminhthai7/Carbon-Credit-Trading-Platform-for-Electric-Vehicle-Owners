"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmail = void 0;
const emailQueue_service_1 = require("../services/emailQueue.service");
const testEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        await emailQueue_service_1.emailQueue.add("sendEmail", { to, subject, message });
        res.status(200).json({ success: true, message: "Email added to queue!" });
    }
    catch (err) {
        console.error("❌ Queue error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.testEmail = testEmail;
