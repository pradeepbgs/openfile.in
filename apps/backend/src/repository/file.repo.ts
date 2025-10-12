import { prisma } from "../config/db";
import { IFileRepo } from "../interface/file.interface";


export class FileRepository implements IFileRepo {
    private static instance: FileRepository

    constructor() { }

    static getInstance() {
        if (!FileRepository.instance) {
            FileRepository.instance = new FileRepository();
        }
        return FileRepository.instance
    }

    async getUser(id: number) {
        return await prisma.user.findUnique({
            where: { id },
            select: { id: true },
        });
    }

    async findLinkByTokenAndUserId(token: string, userId: number) {
        return prisma.link.findFirst({
            where: { token, userId },
        });
    }

    async findFileByIdUserIdAndLinkId(fileId: number, userId: number, linkId: number) {
        return prisma.file.findFirst({
            where: { id: fileId, userId, uploadLinkId: linkId },
        });
    }

    async storageUsed(userId: number) {
        return prisma.file.aggregate({
            where: {
                userId
            },
            _sum: {
                size: true
            }
        })
    }


    async createFileAndUpdateLink({ url, name, size }, linkId: number, userId: number) {
        return await prisma.$transaction([
            prisma.file.create({
                data: {
                    url,
                    name,
                    size,
                    userId,
                    uploadLinkId: linkId,
                },
            }),
            prisma.link.update({
                where: { id: linkId },
                data: {
                    uploadCount: { increment: 1 },
                },
            }),
        ]);
    }

    async getFiles(linkId: number, userId: number, skip: number, limit: number) {
        return await prisma.file.findMany({
            where: {
                uploadLinkId: linkId,
                userId: userId,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    }
}