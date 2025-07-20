import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

export const emailQueue = new Bull("email-queue", process.env.REDIS_URL);
