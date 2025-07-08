import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

export const emailQueue = new Bull("email-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
