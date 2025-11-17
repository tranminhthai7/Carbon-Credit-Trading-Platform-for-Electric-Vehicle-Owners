"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // email người gửi
        pass: process.env.EMAIL_PASS // mật khẩu ứng dụng (App Password)
    }
});
// Hàm gửi email cơ bản
const sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    };
    await exports.transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}`);
};
exports.sendMail = sendMail;
