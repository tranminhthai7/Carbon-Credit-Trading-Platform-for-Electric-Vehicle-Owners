"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getUserNotifications = exports.sendNotification = void 0;
// Gửi notification (ví dụ test)
const sendNotification = (req, res) => {
    const { user_id, title, message } = req.body;
    res.json({
        success: true,
        message: `Notification sent to user ${user_id}`,
        data: { title, message },
    });
};
exports.sendNotification = sendNotification;
// Lấy notifications theo user
const getUserNotifications = (req, res) => {
    const { userId } = req.params;
    res.json({
        userId,
        notifications: [
            { id: 1, title: 'Welcome!', message: 'Cảm ơn bạn đã tham gia nền tảng.' },
            { id: 2, title: 'Giao dịch hoàn tất', message: 'Bạn đã bán thành công 2 tín chỉ carbon.' },
        ],
    });
};
exports.getUserNotifications = getUserNotifications;
// Đánh dấu đã đọc
const markAsRead = (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Notification ${id} marked as read.`,
    });
};
exports.markAsRead = markAsRead;
