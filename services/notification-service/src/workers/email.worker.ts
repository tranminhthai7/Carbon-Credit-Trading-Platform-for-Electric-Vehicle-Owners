import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { sendMail } from "../config/email";

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, message } = job.data;
    await sendMail(to, subject, message);
    console.log(`📨 Worker sent email to ${to}`);
  },
  { connection: redis }
);
