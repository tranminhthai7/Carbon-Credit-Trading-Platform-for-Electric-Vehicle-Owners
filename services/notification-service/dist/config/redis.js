"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
exports.redis = new ioredis_1.Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
});
exports.redis.on("connect", () => console.log("🔌 Connected to Redis"));
exports.redis.on("error", (err) => console.error("❌ Redis error:", err));
