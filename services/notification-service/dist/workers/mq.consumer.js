"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMQConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const queues_1 = require("../config/queues");
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE = process.env.MQ_QUEUE || 'orders';
const startMQConsumer = async () => {
    const conn = await amqplib_1.default.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log('Notification-service: connected to rabbitmq and consuming', QUEUE);
    channel.consume(QUEUE, async (msg) => {
        if (!msg)
            return;
        try {
            const payload = JSON.parse(msg.content.toString());
            console.log('Notification-service received msg', payload);
            if (payload.event === 'order.created') {
                const { data } = payload;
                // enqueue email job to buyer/seller
                const buyerEmail = data?.listing?.contactEmail || 'buyer@example.com';
                await queues_1.emailQueue.add('send-order-created', { to: buyerEmail, subject: 'Order Created', message: `Your order ${data.id} created` });
            }
            if (payload.event === 'order.updated') {
                const { data } = payload;
                const buyerEmail = data?.listing?.contactEmail || 'buyer@example.com';
                await queues_1.emailQueue.add('send-order-updated', { to: buyerEmail, subject: 'Order Update', message: `Order ${data.id} status ${data.status}` });
            }
            channel.ack(msg);
        }
        catch (err) {
            console.error('Error processing MQ message', err);
            channel.nack(msg, false, false); // discard
        }
    });
};
exports.startMQConsumer = startMQConsumer;
