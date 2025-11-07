import { Request, Response } from 'express';

// Gửi notification (ví dụ test)
export const sendNotification = (req: Request, res: Response) => {
  const { user_id, title, message } = req.body;
  res.json({
    success: true,
    message: `Notification sent to user ${user_id}`,
    data: { title, message },
  });
};

// Lấy notifications theo user
export const getUserNotifications = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json({
    userId,
    notifications: [
      { id: 1, title: 'Welcome!', message: 'Cảm ơn bạn đã tham gia nền tảng.' },
      { id: 2, title: 'Giao dịch hoàn tất', message: 'Bạn đã bán thành công 2 tín chỉ carbon.' },
    ],
  });
};

// Đánh dấu đã đọc
export const markAsRead = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Notification ${id} marked as read.`,
  });
};
