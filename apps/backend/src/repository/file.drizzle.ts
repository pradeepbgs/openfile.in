import { and, eq, sql } from "drizzle-orm";
import { files, links } from "../db";
import { IFileRepo } from "../interface/file.interface";
import { DrizzleClient } from "./user.drizzle";


export class FileRepositoryDrizzle implements IFileRepo {
    private static instance: FileRepositoryDrizzle
    private client: DrizzleClient

    constructor(client: DrizzleClient) {
        this.client = client
    }


    static getInstance(client: DrizzleClient) {
        if (!FileRepositoryDrizzle.instance) {
            FileRepositoryDrizzle.instance = new FileRepositoryDrizzle(client);
        }
        return FileRepositoryDrizzle.instance
    }

    async createFileAndUpdateLink(
        { url, name, size }:
            { url: any; name: any; size: any; },
        linkId: number, userId: number) {

        const [createdFile] = await this
            .client
            .insert(files)
            .values({
                url,
                name,
                size: BigInt(size),
                userId,
                uploadLinkId: linkId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        if (!createdFile) {
            console.log('failed to create file')
            return null;
        }

        const [updatedLink] = await this
            .client
            .update(links)
            .set({
                uploadCount: sql`${links.uploadCount}+1`,
            })
            .where(and(eq(links.id, linkId), eq(links.userId, userId)))
            .returning();

        if (!updatedLink) {
            console.log('failed to update link')
            return null;
        }

        return [createdFile!, updatedLink!] as [typeof createdFile, typeof updatedLink];
    }

    async findFileByIdUserIdAndLinkId(fileId: number, userId: number, linkId: number) {
        const result = await this
            .client
            .query
            .files
            .findFirst({
                where: and(
                    eq(files.id, fileId),
                    eq(files.userId, userId),
                    eq(files.uploadLinkId, linkId)
                )
            })

        return result
    }

    async findLinkByTokenAndUserId(token: string, userId: number) {
        const result = await this
            .client
            .query
            .links
            .findFirst({
                where: and(
                    eq(links.token, token),
                    eq(links.userId, userId)
                )
            })

        return result;
    }

    async getFiles(linkId: number, userId: number, skip: number, limit: number) {
        const result = await this
            .client
            .query
            .files
            .findMany({
                where: and(
                    eq(files.uploadLinkId, linkId),
                    eq(files.userId, userId)
                ),
                offset: skip,
                limit: limit,
                orderBy: sql`${files.createdAt} DESC`
            })

        return result;
    }

    async getUser(id: number): Promise<{ id: number; } | null> {
        const result = await this
            .client
            .query
            .users
            .findFirst({
                where: eq(links.id, id),
                columns: { id: true }
            })

        return result;
    }

    async storageUsed(userId: number) {
        const result = this.client
            .select({
                totalSize: sql<number>`SUM(${files.size})`
            })
            .from(files)
            .where(eq(files.userId, userId));
        
        return result;
    }
}

// local test
