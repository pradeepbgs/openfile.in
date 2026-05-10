import app from "./app";
import { deleteQueue } from "./src/queue/bullmq/queue/delete-files.queue";
import { redis } from "./src/config/redis";
import { cleanupService, deletedFileRepository, userRepository } from "./server.conf";


const port = process.env.PORT || 8000;

async function requeueFilesByStatus(status: 'PENDING' | 'FAILED') {
    let total = await deletedFileRepository.findExpiredLinkCount(status)
    console.log(`[Recovery] Found ${total} ${status} deleted files.`);

    let offset = 0;
    const BATCH_SIZE = 50;

    while (total > 0) {
        const limit = Math.min(BATCH_SIZE, total)
        const files = await deletedFileRepository.findExpiredFiles(status, limit, offset)

        const grouped = new Map<string, { id: string, url: string }[]>();
        for (const file of files) {
            const group = grouped.get(file.linkId) || [];
            group.push({ id: file.fileId, url: file.fileUrl });
            grouped.set(file.linkId, group);
        }

        for (const [linkId, groupedFiles] of grouped) {
            deleteQueue.add('delete-files', { linkId, files: groupedFiles });
        }

        total = total - limit
        offset = offset + limit
        console.log(`[Recovery] Requeued ${files.length} ${status} deleted files.`);
    }
}

export async function pushPendingFilesToQueue() {
    await requeueFilesByStatus('PENDING');
    await requeueFilesByStatus('FAILED');
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


cleanupService.run_delete_file_worker()
cleanupService.runInterval(process.env.CLEANUP_INTERVAL ?? "10m");

const user = await userRepository.findUserByUsername("okay")
console.log('user ', user)

pushPendingFilesToQueue()
    .catch(err =>
        console.error("Failed to requeue deleted files:", err)
    );


Bun?.serve({
    port,
    fetch: app.fetch() as any,
    // key: Bun.file("./localhost.key"),
    // cert: Bun.file("./localhost.crt"),
});

console.log(`Listening on http://localhost:${port}`);
