import app from "./app";
import { deleteQueue } from "./src/bullmq/queue/delete-files.queue";
import { prisma } from "./src/config/db";
import { redis } from "./src/config/redis";
import { cleanupService } from "./server.conf";


const port = process.env.PORT || 8000;

export async function pushPendingFilesToQueue() {

    let totalExpiredFiles = await prisma.deletedFile.count({
        where: { status: 'PENDING' },
    })
    console.log(`[Recovery] Found ${totalExpiredFiles} pending deleted files.`);

    let offset = 0;
    const BATCH_SIZE = 50;

    while (totalExpiredFiles > 0) {
        const limit = Math.min(BATCH_SIZE, totalExpiredFiles)
        const files = await prisma.deletedFile.findMany({
            where: { status: 'PENDING' },
            take: limit,
            skip: offset,
            select: {
                linkId: true,
                fileUrl: true,
                fileId: true,
            },
        });

        const grouped = new Map<number, { id: number, url: string }[]>();
        for (const file of files) {
            const group = grouped.get(file.linkId) || [];
            group.push({ id: file.fileId, url: file.fileUrl });
            grouped.set(file.linkId, group);
        }

        for (const [linkId, files] of grouped) {
            deleteQueue.add('delete-files', { linkId, files });
        }

        totalExpiredFiles = totalExpiredFiles - limit
        offset = offset + limit
        console.log(`[Recovery] Requeued ${files.length} pending deleted files.`);
    }
}


if (process.env.NODE_ENV === "development") {
    (
        async () => {
            await redis.flushall();
            await redis.flushdb();
        }
    )()

    // prisma.ipLog.deleteMany()
    // prisma.file.deleteMany()
    // prisma.link.deleteMany()
    // await prisma.user.deleteMany()
}


cleanupService.LinkCleanup()
cleanupService.run_delete_file_worker()


cleanupService.addQueue(10);
cleanupService.runInterval();
// cleanup.runWoker();


pushPendingFilesToQueue()
    .catch(err =>
        console.error("Failed to requeue deleted files:", err)
    );


// startSystemMonitor(10 * 60 * 1000)


export default {
    port,
    fetch: app.fetch,
}
// serve({
//     port,
//     fetch: app.fetch,
//     // key: Bun.file("./localhost.key"),
//     // cert: Bun.file("./localhost.crt"),
// });

// console.log(`Listening on http://localhost:${port}`);
