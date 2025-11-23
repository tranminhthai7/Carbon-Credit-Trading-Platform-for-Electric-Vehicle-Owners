// Simple no-op / console-based MQ shim used in local/dev to avoid build-time failures.
// In production this can be swapped to a real RabbitMQ / Kafka / NATS publisher.
/*
 * MQ helper for marketplace-service
 * - If RABBITMQ_URL is not set, publishEvent is a safe no-op that logs to console (dev-friendly).
 * - If RABBITMQ_URL is set, we attempt to publish using amqplib at runtime (best-effort).
 *
 * We use a runtime require for amqplib so builds do not require the package to be present
 * unless the environment actually needs MQ behaviour. This keeps local builds simple.
 */

const RABBITMQ_URL = process.env.RABBITMQ_URL || '';

export const publishEvent = async (topic: string, payload: any) => {
  if (!RABBITMQ_URL) {
    // Local / test mode — don't require external MQ. Just log for observability.
    console.log('[mq] publish (noop)', { topic, payload });
    return;
  }

  try {
    // dynamic require so the dependency is optional for local builds
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const amqplib = require('amqplib');
    const conn = await amqplib.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(topic, { durable: true });
    ch.sendToQueue(topic, Buffer.from(JSON.stringify(payload)), { persistent: true });
    await ch.close();
    await conn.close();
  } catch (err) {
    // best-effort publish — don't fail the caller if MQ is unreachable
    console.warn('[mq] publish failed (best-effort)', err);
  }
}

export const connect = async () => {
  if (!RABBITMQ_URL) return Promise.resolve(null);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const amqplib = require('amqplib');
    const conn = await amqplib.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue('health-check', { durable: false });
    return { conn, ch };
  } catch (err) {
    console.warn('[mq] connect failed (best-effort)', err);
    return null;
  }
}
