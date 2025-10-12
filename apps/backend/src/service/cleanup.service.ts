import { cleanupQueue } from "../bullmq/queue/cleanup-queue";
import { deleteQueue } from "../bullmq/queue/delete-files.queue";
import { Job, Worker } from "bullmq";
import { ILinkRepo } from "../interface/link.interface";
import { IDeleteFileRepo } from "../interface/delete-file.interface";
import { deleteFiles } from "../bullmq/workers/delete-files.worker";
import { ICache } from "../interface/cache.interface";
import { redis } from "../config/redis";


export default class CleanupService {
    private static instance: CleanupService;
    private intervalId: NodeJS.Timeout | null
    private cache: ICache

    private linkRepository: ILinkRepo
    private deletedFileRepo: IDeleteFileRepo

    constructor(
        linkRepository: ILinkRepo,
        deletedFileRepo: IDeleteFileRepo,
        cache: ICache
    ) {
        this.linkRepository = linkRepository
        this.deletedFileRepo = deletedFileRepo
        this.intervalId = null;
        this.cache = cache
    }

    public static getInstance(
        linkRepository: ILinkRepo,
         deletedFileRepo: IDeleteFileRepo,
         cache:ICache
        ): CleanupService {
        if (!CleanupService.instance) {
            CleanupService.instance = new CleanupService(linkRepository, deletedFileRepo, cache);
        }
        return CleanupService.instance;
    }

    private async runExclusive(fn: () => Promise<void>) {
        const lockKey = "cleanup-lock";
        const lockTtlMs = 60 * 1000;
        const acquired = await this.cache.setWithOptions(lockKey, "locked", { PX: lockTtlMs, NX: true });
        if (!acquired) {
            console.warn("Skipped: cleanup already in progress by another process.");
            return;
        }
 
        try {
            await fn()
        } catch (error) {
            console.error("Error in guarded execution:", error);
        } finally {
            await this.cache.del(lockKey);
        }
    }

    parseInterval = (value: string): number => {
        const match = value.match(/^(\d+)(s|m|h)$/);
        if (!match) throw new Error("Invalid interval format. Use '10s', '5m', or '1h'.");

        const [, amountStr, unit] = match;
        const amount = parseInt(amountStr, 10);

        switch (unit) {
            case 's': return amount * 1000;
            case 'm': return amount * 60 * 1000;
            case 'h': return amount * 60 * 60 * 1000;
            default: throw new Error("Unsupported time unit.");
        }
    };

    runInterval = async (interval = "10s") => {
        const intervalMs = this.parseInterval(interval);

        this.intervalId = setInterval(async () => {
            await this.runExclusive(this.cleanupExpiredLinks)
        }, intervalMs);
    }

    stopInterval = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    addQueue = async (minute: number = 10) => {
        await cleanupQueue.add(
            "cleanup-expired-links",
            {},
            {
                repeat: { every: minute * 60 * 1000 },
                removeOnComplete: true,
            }
        );
    }

    runWorker = async () => {
        new Worker('cleanup', async () => {
            await this.runExclusive(this.cleanupExpiredLinks)
        }, { connection: redis })
    }


    public run_delete_file_worker = () => {
        console.log("\nstarting delete file worker\n")
        new Worker("delete-queue", async (job: Job) => {
            try {
                const { data } = job
                const { linkId, files } = data
                await deleteFiles(files, linkId)
            } catch (error) {
                console.log('file deletion failed', error)
            }
        },
            {
                connection: redis,
                maxStalledCount: 2,
                limiter: { max: 5, duration: 1000 },
                concurrency: 3
            }
        )
    }

    public LinkCleanup() {
        return {
            runWoker: this.runWorker,
            runInterval: this.runInterval,
            addQueue: this.addQueue
        }
    }

    private cleanupExpiredLinks = async () => {
        try {
            let totalLinks = await this.linkRepository.expired_link_count()

            let offset = 0;
            const BATCH_SIZE = 50;

            while (totalLinks > 0) {
                const limit = Math.min(BATCH_SIZE, totalLinks)

                // const expiredLinks = await prisma.link.findMany({
                //     where: {
                //         expiresAt: { lt: new Date() },
                //     },
                //     include: { files: true },
                //     take: limit,
                //     skip: offset
                // })

                const expiredLinks = await this.linkRepository.find_expired_links(limit, offset)

                if (expiredLinks.length === 0) {
                    break;
                }

                await Promise.all(expiredLinks.map(async (link) => {
                    const files = link.files
                    const fileUrls = files.map(file => file.url)

                    if (fileUrls.length > 0) {
                        // await prisma.deletedFile.createMany({
                        //     data: files.map((file) => ({
                        //         fileId: file.id,
                        //         linkId: link.id,
                        //         fileUrl: file.url,
                        //         status: 'PENDING',
                        //     }))
                        // })
                        await this.deletedFileRepo.createMany(files, link.id)
                        await deleteQueue.add('delete-queue', {
                            linkId: link.id,
                            files: files.map(file => ({
                                id: file.id,
                                url: file.url
                            }))
                        });
                    }

                    await this.linkRepository.delete_link_by_id(link.id)

                }))

                totalLinks = totalLinks - limit
                offset = offset + limit
                console.log(`Remaining expired links: ${totalLinks}`);
            }
        } catch (error) {
            console.error('error while cleaning up expired links', error)
        }
    }

}