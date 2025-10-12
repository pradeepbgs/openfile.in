import { Job, Worker } from "bullmq";
import { prisma } from "../../config/db";
import { redis } from "../../config/redis";
import { storageService } from "../../../server.conf";

interface FileItem {
    id: number;
    url: string;
}


// console.log("\nstarting delete file worker\n")
// new Worker("delete-queue", async (job: Job) => {
//     try {
//         const { data } = job
//         const { linkId, files } = data
//         await deleteFiles(files, linkId)
//     } catch (error) {
//         console.log('file deletion failed', error)
//     }
// },
//     {
//         connection: redis,
//         maxStalledCount: 2,
//         limiter: { max: 5, duration: 1000 },
//         concurrency: 3
//     }
// )

export async function deleteFiles(files: FileItem[], linkId: number) {

    const updatePromises = [];

    for (const file of files) {
        try {

            await storageService.deleteFiles([{ id: file.id, url: file.url }])
            updatePromises.push(
                prisma.deletedFile.updateMany({
                    where: {
                        fileId: file.id
                    },
                    data: {
                        status: 'DELETED',
                        deletedAt: new Date()
                    }
                })
            );
        } catch (err) {
            console.log(`File not found in S3: ${file.url}, marking as deleted`);
            if (
                err.code === "NoSuchKey" ||
                err.statusCode === 404 ||
                err.statusCode === 204
            ) {
                updatePromises.push(
                    prisma.deletedFile.updateMany({
                        where: {
                            fileId: file.id,
                            linkId: linkId,
                        },
                        data: {
                            status: "DELETED",
                            deletedAt: new Date(),
                        },
                    })
                );
            }
            else {
                updatePromises.push(
                    prisma.deletedFile.updateMany({
                        where: {
                            fileId: file.id,
                            linkId: linkId,
                        },
                        data: {
                            status: "FAILED",
                        },
                    })
                );
            }
        }
    }

    await Promise.all(updatePromises)
}