import { and, count, eq, ilike, lt, or, sql } from "drizzle-orm";
import { ILinkRepo } from "../interface/link.interface";
import { DrizzleClient } from "./user.drizzle";
import { files, links, users } from "../db/schema";
import { ONE_DAY } from "../service/link.service";
import { createDBClient } from "../config/db";
import { LinkRepository } from "./link.repo";



export class LinkRepositoryDrizzle implements ILinkRepo {
    private static instance: LinkRepositoryDrizzle
    private client: DrizzleClient;

    constructor(client: DrizzleClient) {
        this.client = client;
    }

    static getInstance(client: DrizzleClient) {
        if (!LinkRepositoryDrizzle.instance) {
            LinkRepositoryDrizzle.instance = new LinkRepositoryDrizzle(client);
        }
        return LinkRepositoryDrizzle.instance
    }

    async FindLinkWithTokenIvAndKey(token: string) {
        const result = await this
            .client
            .select()
            .from(links)
            .where(eq(links.token, token))
            .limit(1)
        return result[0] ?? null;
    }

    async FindUserLinksCount(userId: number) {
        const result = this
            .client
            .$count(links, eq(links.userId, userId))

        return result ?? null;
    }

    async createLink(
        { finalMaxUploads,
            token,
            expireAfterFirstUpload,
            finalExpiration,
            name,
            userId,
            shouldResetLinkCountExpiration,
            now,
            linkCountexpireAt }
            : {
                finalMaxUploads: number;
                token: string;
                finalExpiration: Date | string;
                userId: number;
                name: string;
                expireAfterFirstUpload: boolean;
                shouldResetLinkCountExpiration: boolean;
                now: Date;
                linkCountexpireAt: Date;
            }
    ) {
        const [createdLink] = await this
            .client
            .insert(links)
            .values({
                maxUploads: finalMaxUploads,
                token,
                uploadCount: 0,
                expiresAt: finalExpiration as any,
                userId: userId,
                name: name,
                expireAfterFirstUpload: expireAfterFirstUpload || false,
                createdAt: new Date(now.getTime()),
                updatedAt: new Date(now.getTime())
            })
            .returning()

        if (!createdLink) {
            console.log('failed to generate link')
            return null;
        }

        const [updatedUser] = await this
            .client
            .update(users)
            .set({
                linkCount: shouldResetLinkCountExpiration
                    ? 1
                    : sql`${users.linkCount}+1`,
                linkCountExpireAt: shouldResetLinkCountExpiration
                    ? new Date(now.getTime() + ONE_DAY)
                    : linkCountexpireAt
            })
            .where(eq(users.id, userId))
            .returning()
        if (!updatedUser) {
            console.log('failed to update user ', userId)
            return null;
        }

        // fuck this TS
        return [createdLink!, updatedUser!] as [typeof createdLink, typeof updatedUser];
    }

    async deleteFilesForLink(linkId: number, userId: number) {
        const result = await this
            .client
            .delete(files)
            .where(and(eq(files.uploadLinkId, linkId), eq(files.userId, userId)))
            .returning();
        return { count: result.length };
    }

    async deleteLink(linkId: number, userId: number) {
        const result = await this
            .client
            .delete(links)
            .where(and(eq(links.id, linkId), eq(links.userId, userId)))
            .returning()
        return result[0] ?? null;
    }

    async delete_link_by_id(id: number) {
        const result = await this
            .client
            .delete(links)
            .where(eq(links.id, id))
            .returning();
        return result[0] ?? null;
    }

    async expired_link_count() {
        const result = await this
            .client
            .select({ count: count() })
            .from(links)
            .where(lt(links.expiresAt, new Date()));

        return result[0]?.count ?? 0;
    }

    async findFilesForLink(linkId: number, userId: number) {
        const result = await this
            .client
            .select()
            .from(files)
            .where(and(eq(files.uploadLinkId, linkId), eq(files.userId, userId)));

        return result;
    }

    async findLinkByIdAndUser(linkId: number, userId: number) {
        const result = await this
            .client
            .query
            .links
            .findFirst({
                where: and(
                    eq(links.id, linkId),
                    eq(links.userId, userId),
                ),
                columns: {
                    id: true,
                    token: true,
                },
                with: {
                    files: {
                        columns: {
                            url: true,
                            id: true
                        }
                    }
                }
            })

        return result ?? null;
    }

    async findLinkByToken(token: string) {
        const result = await this
            .client
            .select()
            .from(links)
            .where(eq(links.token, token))
            .limit(1);

        return result[0] ?? null;
    }

    async findLinkByTokenAndUserId(token: string, userId: number) {
        const result = await this
            .client
            .select()
            .from(links)
            .where(and(eq(links.token, token), eq(links.userId, userId)))
            .limit(1);

        return result[0] ?? null;
    }

    async findLinkUploadCount(linkId: number) {
        const result = await this
            .client
            .select({ uploadCount: links.uploadCount })
            .from(links)
            .where(eq(links.id, linkId))
            .limit(1);

        return result[0] ?? null;
    }

    async findLinkWithFilesByTokenAndUserId(linkId: number, token: string, userId: number, skip: number, limit: number) {
        const link = await this
            .client
            .query
            .links
            .findFirst({
                where: and(
                    eq(links.id, linkId),
                    eq(links.userId, userId),
                    eq(links.token, token)
                ),
                columns: { id: true, token: true },
            });

        if (!link) {
            console.log('could not find link ')
            return null;
        }

        const fileList = await this
            .client
            .query
            .files
            .findMany({
                where: and(
                    eq(files.uploadLinkId, linkId),
                ),
                columns: {
                    id: true,
                    name: true,
                    url: true,
                    size: true,
                    createdAt: true,
                },
                offset: skip,
                limit: limit,
                orderBy: sql`${files.createdAt} DESC`
            })
        return { ...link, files: fileList };
    }

    async findUserLinks(userId: number, query: string, skip: number, limit: number) {
        const result = await this
            .client
            .select({
                id: links.id,
                name: links.name,
                token: links.token,
                createdAt: links.createdAt,
                maxUploads: links.maxUploads,
                expiresAt: links.expiresAt,
                uploadCount: links.uploadCount
            })
            .from(links)
            .where(and(
                eq(links.userId, userId),
                or(
                    ilike(links.name, `%${query}%`),
                    ilike(links.token, `%${query}%`)
                )
            ))
            .offset(skip)
            .limit(limit)
            .orderBy(sql`${links.createdAt} DESC`);

        return result;
    }

    async find_expired_links(limit: number, offset: number) {
        const result = await this
            .client
            .query
            .links
            .findMany({
                where: lt(links.expiresAt, new Date()),
                with: {
                    files: true
                },
                limit: limit,
                offset: offset
            });
        return result;
    }
}


; (
    async () => {

        const ddb = createDBClient('drizzle')
        const pdb = createDBClient('prisma')

        const dc = new LinkRepositoryDrizzle(ddb as any)
        const pc = new LinkRepository(pdb as any)

            ; await (async () => {

                const prisma_link = await pc.createLink({
                    finalMaxUploads: 10,
                    token: 'prisma_test' + Math.random(),
                    finalExpiration: new Date(),
                    userId: 1,
                    name: 'test',
                    expireAfterFirstUpload: true,
                    shouldResetLinkCountExpiration: false,
                    now: new Date(),
                    linkCountexpireAt: new Date()
                })
                console.log('prisma ', prisma_link)

                const drizzle_link = await dc.createLink({
                    finalMaxUploads: 10,
                    token: 'drizzle_test' + Math.random(),
                    finalExpiration: new Date(),
                    userId: 1,
                    name: 'test',
                    expireAfterFirstUpload: true,
                    shouldResetLinkCountExpiration: false,
                    now: new Date(),
                    linkCountexpireAt: new Date()
                })
                console.log('drizzle ', drizzle_link)
            })
        // ();

        // find link by token
        const token = '0199c9a3-2dc9-7bfd-ac22-8270219957bf'
            ; await (async () => {


                const prisma_link = await pc.findLinkByToken(token)
                console.log('prisma ', prisma_link)

                const drizzle_link = await dc.findLinkByToken(token)
                console.log('drizzle ', drizzle_link)
            })
            // ();

            // find link by token and userId
            ; await (async () => {

                const prisma_link = await pc.findLinkByTokenAndUserId(token, 1)
                console.log('prisma ', prisma_link)

                const drizzle_link = await dc.findLinkByTokenAndUserId(token, 1)
                console.log('drizzle ', drizzle_link)

            })
            // ()

            // link count
            ; await (
                async () => {
                    const prisma_link = await pc.findLinkUploadCount(49)
                    console.log('prisma ', prisma_link)

                    const drizzle_link = await dc.findLinkUploadCount(49)
                    console.log('drizzle ', drizzle_link)
                }
            )
            // ();

            // 
            ; await (
                async () => {
                    const prisma_link = await pc.findLinkByIdAndUser(253, 1)
                    console.log('prisma ', prisma_link)

                    const drizzle_link = await dc.findLinkByIdAndUser(254, 1)
                    console.log('drizzle ', drizzle_link)
                }
            )
            // ()

            // 
            ; await (
                async () => {
                    const prisma_link = await pc.findFilesForLink(49, 1)
                    console.log('prisma ', prisma_link)

                    const drizzle_link = await dc.findFilesForLink(49, 1)
                    console.log('drizzle ', drizzle_link)
                }
            )
            // ()

            // FindUserLinksCount
            ; await (
                async () => {
                    const prisma_count = await pc.FindUserLinksCount(1)
                    console.log('prisma FindUserLinksCount', prisma_count)

                    const drizzle_count = await dc.FindUserLinksCount(1)
                    console.log('drizzle FindUserLinksCount', drizzle_count)
                }
            )
            // ()

            // findLinkWithFilesByTokenAndUserId
            ; await (
                async () => {
                    const prisma_link = await pc.findLinkWithFilesByTokenAndUserId(253, token, 1, 0, 10)
                    console.log('prisma findLinkWithFilesByTokenAndUserId', prisma_link)

                    const drizzle_link = await dc.findLinkWithFilesByTokenAndUserId(253, token, 1, 0, 10)
                    console.log('drizzle findLinkWithFilesByTokenAndUserId', drizzle_link)
                }
            )
            // ()

            // findUserLinks
            ; await (
                async () => {
                    const prisma_links = await pc.findUserLinks(1, 'test', 0, 10)
                    console.log('prisma findUserLinks', prisma_links)

                    const drizzle_links = await dc.findUserLinks(1, 'test', 0, 10)
                    console.log('drizzle findUserLinks', drizzle_links)
                }
            )
            // ()

            // expired_link_count
            ; await (
                async () => {
                    const prisma_count = await pc.expired_link_count()
                    console.log('prisma expired_link_count', prisma_count)

                    const drizzle_count = await dc.expired_link_count()
                    console.log('drizzle expired_link_count', drizzle_count)
                }
            )
            // ()

            // find_expired_links
            ; await (
                async () => {
                    const prisma_links = await pc.find_expired_links(10, 0)
                    console.log('prisma find_expired_links', prisma_links)

                    const drizzle_links = await dc.find_expired_links(10, 0)
                    console.log('drizzle find_expired_links', drizzle_links)
                }
            )
        // ()

        // Note: Destructive actions like delete are commented out by default to prevent accidental data loss.
        // deleteLink
        // ; (async () => {
        //     // const prisma_deleted = await pc.deleteLink(someLinkId, 1)
        //     // const drizzle_deleted = await dc.deleteLink(someOtherLinkId, 1)
        // })()


        process.exit(1)

    }
)
    // ()