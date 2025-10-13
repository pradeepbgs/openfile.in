import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis();

export const uploadQueue = new Queue("uploadQueue", { connection });

export interface UploadJob {
    userId: number;
    linkId: number;
    filename: string;
    socketId: string;
    size: number;
}
