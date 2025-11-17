const express = require('express');
const bodyParser = require('body-parser');
const amqplib = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE = process.env.MQ_QUEUE || 'transactions';

const app = express();
app.use(bodyParser.json());

let channel;

async function connect() {
  try {
    const conn = await amqplib.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log('MQ Producer connected to', RABBITMQ_URL);
  } catch (err) {
    console.error('MQ Producer error', err);
    setTimeout(connect, 5000);
  }
}

app.post('/publish', async (req, res) => {
  const message = req.body || {};
  try {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
    return res.status(200).json({ success: true, message: 'Sent to MQ' });
  } catch (err) {
    console.error('Publish error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', queue: QUEUE }));

connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('MQ Producer listening on', PORT));
