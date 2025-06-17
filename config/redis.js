// config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
