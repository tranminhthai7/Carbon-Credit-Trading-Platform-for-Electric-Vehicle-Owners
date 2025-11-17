"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const email_1 = require("../config/email");
exports.emailWorker = new bullmq_1.Worker("emailQueue", async (job) => {
    const { to, subject, message } = job.data;
    await (0, email_1.sendMail)(to, subject, message);
    console.log(`📨 Worker sent email to ${to}`);
}, { connection: redis_1.redis });
