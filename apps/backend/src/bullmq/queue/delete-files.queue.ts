import { Queue } from "bullmq";
import { redis } from "../../config/redis";

export const deleteQueue = new Queue("delete-queue", { connection: redis })