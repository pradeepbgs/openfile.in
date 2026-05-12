import { deleteQueue } from "./src/queue/bullmq/queue/delete-files.queue";
import { redis } from "./src/config/redis";
import { cleanupService, deletedFileRepository, userRepository } from "./server.conf";


const port = process.env.PORT || 8000;

export async function pushPendingFilesToQueue() {
    let totalExpiredFiles = await deletedFileRepository.findExpiredLinkCount('PENDING')
    console.log(`[Recovery] Found ${totalExpiredFiles} pending deleted files.`);

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
    await redis.flushall();
    await redis.flushdb();
}

cleanupService.run_delete_file_worker()
cleanupService.runInterval(process.env.CLEANUP_INTERVAL ?? "10m");

pushPendingFilesToQueue()
    .catch(err => console.error("Failed to requeue deleted files:", err));

startServer()
    .catch(err => {
        console.error('[Server] Failed to start:', err)
        process.exit(1)
    })
