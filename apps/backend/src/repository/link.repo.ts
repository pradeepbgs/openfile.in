import { prisma } from "../config/db";
import { ILinkRepo } from "../interface/link.interface";
import { ONE_DAY } from "../service/link.service";


export class LinkRepository implements ILinkRepo{
    private static instance: LinkRepository

    constructor() { }

    static getInstance() {
        if (!LinkRepository.instance) {
            LinkRepository.instance = new LinkRepository();
        }
        return LinkRepository.instance
    }

    async findLinkByIdAndUser(linkId: number, userId: number) {
        return await prisma.link.findFirst({
            where: { id: linkId, userId },
            select: {
                id: true,
                token: true,
                files: {
                    select: {
                        url: true,
                        id: true,
                    }
                }
            }
        });
    }

    async findLinkByTokenAndUserId(token: string, userId: number) {
        return prisma.link.findFirst({
            where: { token, userId },
        });
    }

    async findLinkByToken(token: string) {
        return await prisma.link.findFirst({
            where: {
                token
            }
        })
    }

    async FindLinkWithTokenIvAndKey(token: string) {
        return prisma.link.findFirst({
            where: {
                token: token
            }
        })
    }

    async findFilesForLink(linkId: number, userId: number) {
        return prisma.file.findMany({
            where: { uploadLinkId: linkId, userId },
        });
    }

    async deleteFilesForLink(linkId: number, userId: number) {
        return prisma.file.deleteMany({
            where: { uploadLinkId: linkId, userId },
        });
    }

    async deleteLink(linkId: number, userId: number) {
        return prisma.link.delete({
            where: { id: linkId, userId },
        });
    }

    async delete_link_by_id(id: number){
        return await prisma.link.delete({ where: { id } })
    }

    async findLinkWithFilesByTokenAndUserId(linkId: number, token: string, userId: number, skip: number, limit: number) {
        return await prisma.link.findFirst({
            where: {
                id: linkId,
                userId,
                token
            },
            select: {
                id: true,
                files: {
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        name: true,
                        url: true,
                        size: true,
                        createdAt: true
                    }
                }
            }
        });
    }


    async findUserLinks(userId: number, query: string, skip: number, limit: number) {
        return await prisma.link.findMany({
            where: {
                userId,
                OR: [
                    { name: { contains: query } },
                    { token: { contains: query } }
                ]
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                token: true,
                createdAt: true,
                maxUploads: true,
                expiresAt: true,
                uploadCount: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findLinkUploadCount(linkId: number) {
        return await prisma.link.findUnique({
            where: { id: linkId },
            select: { uploadCount: true },
        });
    }

    async FindUserLinksCount(userId: number) {
        return await prisma.link.count({ where: { userId } })
    }

    async createLink(
        {
            finalMaxUploads,
            token,
            expireAfterFirstUpload,
            finalExpiration,
            name = '',
            userId,
            shouldResetLinkCountExpiration,
            now,
            linkCountexpireAt
        }
            : {
                finalMaxUploads: number
                token: string
                finalExpiration: Date | string
                userId: number
                name: string
                expireAfterFirstUpload: boolean
                shouldResetLinkCountExpiration: boolean
                now: Date
                linkCountexpireAt: Date
            }
    ) {
        return await prisma.$transaction([
            prisma.link.create({
                data: {
                    maxUploads: finalMaxUploads,
                    token,
                    uploadCount: 0,
                    expiresAt: finalExpiration,
                    userId: userId,
                    name: name,
                    expireAfterFirstUpload: expireAfterFirstUpload || false
                }
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    linkCount: shouldResetLinkCountExpiration ? 1 : { increment: 1 },
                    linkCountExpireAt: shouldResetLinkCountExpiration
                        ? new Date(now.getTime() + ONE_DAY) : linkCountexpireAt // for 1 day
                }
            })
        ])
    }

    async expired_link_count() {
        return await prisma.link.count({
            where: {
                expiresAt: { lt: new Date() },
            },
        })
    }

    async find_expired_links(limit: number, offset: number) {
        return await prisma.link.findMany({
            where: {
                expiresAt: { lt: new Date() },
            },
            include: { files: true },
            take: limit,
            skip: offset
        })
    }
}