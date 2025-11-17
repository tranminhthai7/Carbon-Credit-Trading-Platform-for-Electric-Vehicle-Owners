"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
router.post('/send', notification_controller_1.sendNotification);
router.get('/:userId', notification_controller_1.getUserNotifications);
router.put('/:id/read', notification_controller_1.markAsRead);
exports.default = router;
