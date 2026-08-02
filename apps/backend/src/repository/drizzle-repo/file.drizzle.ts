import { and, eq, sql } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { files, links } from "../../db";
import { IFileRepo } from "../../interface/file.interface";
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
        { linkId, userId, url, name, size }:
            { linkId: string, userId: string, url: string, name: string, size: bigint }) {
                console.log('creating file', name, size, userId, linkId)
        const [createdFile] = await this
            .client
            .insert(files)
            .values({
                id: uuidv7(),
                url,
                name,
                size,
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

    async findFileByIdUserIdAndLinkId(fileId: string, userId: string, linkId: string) {
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

    async findLinkByTokenAndUserId(token: string, userId: string) {
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

    async getFiles(linkId: string, userId: string, skip: number, limit: number) {
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

    async getUser(id: string): Promise<{ id: string; } | null> {
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

    async storageUsed(userId: string) {
        const result = await this.client
            .select({
                totalSize: sql<number>`SUM(${files.size})`
            })
            .from(files)
            .where(eq(files.userId, userId))
            .limit(1)
        
        return result[0]
    }

    async get_file_by_id(id:string) {
        const result = await this.client.query.files.findFirst({
            where: eq(files.id, id),
        })
        return result;
    }

    async get_file_by_id_and_userid(id:string,user_id:string){
        const result = await this.client.query.files.findFirst({
            where: and(
                eq(files.id, id),
                eq(files.userId, user_id)
            )
        })
        return result;
    }

    async delete_file_from_link(file_id:string, link_id:string, user_id:string) {
        const [deletedFile] = await this
            .client
            .delete(files)
            .where(and(
                eq(files.id, file_id),
                eq(files.uploadLinkId, link_id),
                eq(files.userId, user_id)
            ))
            .returning();

        if (!deletedFile) return null;

        // await this
        //     .client
        //     .update(links)
        //     .set({
        //         uploadCount: sql`GREATEST(${links.uploadCount}-1, 0)`,
        //     })
        //     .where(and(eq(links.id, link_id), eq(links.userId, user_id)))

        return deletedFile;
    }
}

// local test
