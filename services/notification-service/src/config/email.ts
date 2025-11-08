import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // email người gửi
    pass: process.env.EMAIL_PASS  // mật khẩu ứng dụng (App Password)
  }
});

// Hàm gửi email cơ bản
export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Email sent to ${to}`);
};
