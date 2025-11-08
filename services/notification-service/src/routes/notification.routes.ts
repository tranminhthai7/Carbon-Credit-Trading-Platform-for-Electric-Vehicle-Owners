import { Router } from 'express';
import { sendNotification, getUserNotifications, markAsRead } from '../controllers/notification.controller';

const router = Router();

router.post('/send', sendNotification);
router.get('/:userId', getUserNotifications);
router.put('/:id/read', markAsRead);

export default router;
