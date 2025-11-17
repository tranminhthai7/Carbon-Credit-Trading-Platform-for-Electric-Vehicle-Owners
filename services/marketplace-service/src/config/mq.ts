import * as amqplib from 'amqplib';
import { Channel, Connection } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
let channel: any = null;

export const connectMQ = async (): Promise<any> => {
  if (channel) return channel;
  const conn: any = await amqplib.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  console.log('Marketplace-service connected to RabbitMQ at', RABBITMQ_URL);
  return channel;
};

export const publishEvent = async (queue: string, payload: any) => {
  const ch = await connectMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
};
