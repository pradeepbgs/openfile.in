import { Queue } from "bullmq";
import { redis } from "../../config/redis";


export const IpQueue = new Queue("ip-queue", { connection: redis });
