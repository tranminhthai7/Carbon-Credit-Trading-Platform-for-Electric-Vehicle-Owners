import amqplib from 'amqplib';
import { emailQueue } from '../config/queues';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE = process.env.MQ_QUEUE || 'orders';

export const startMQConsumer = async () => {
  const conn = await amqplib.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  console.log('Notification-service: connected to rabbitmq and consuming', QUEUE);
  channel.consume(QUEUE, async (msg: any) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      console.log('Notification-service received msg', payload);
      if (payload.event === 'order.created') {
        const { data } = payload;
        // enqueue email job to buyer/seller
        const buyerEmail = data?.listing?.contactEmail || 'buyer@example.com';
        await emailQueue.add('send-order-created', { to: buyerEmail, subject: 'Order Created', message: `Your order ${data.id} created` });
      }
      if (payload.event === 'order.updated') {
        const { data } = payload;
        const buyerEmail = data?.listing?.contactEmail || 'buyer@example.com';
        await emailQueue.add('send-order-updated', { to: buyerEmail, subject: 'Order Update', message: `Order ${data.id} status ${data.status}` });
      }
      channel.ack(msg);
    } catch (err) {
      console.error('Error processing MQ message', err);
      channel.nack(msg, false, false); // discard
    }
  });
};
