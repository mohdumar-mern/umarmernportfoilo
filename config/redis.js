// config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.REDIS_URL);

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false, // Needed for Upstash
  },
});



redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
