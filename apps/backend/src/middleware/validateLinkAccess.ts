import { Context } from "hono";
import { redis } from "../config/redis";
import { uploadRequestSchema } from "../zod/schema";
import { LinkRepository } from "../repository/link.repo";
import { HTTPException } from "hono/http-exception";
import { calculateTTL, script } from "../utils/helper";




export const validateLinkAccessM = async (c: Context, next) => {
    try {
        const link = c.get("link");

        const body = await c.req.json();
        const parsed = uploadRequestSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ error: parsed.error.format() }, 400);
        }

        const { mimeType, fileSize } = parsed.data;

        const redisKey = `upload:count:${link.id}`;
        const maxUploads = link.maxUploads
        const ttl = calculateTTL(fileSize);
        const expireAfterFirst = link.expireAfterFirstUpload ? "1" : "0";

        const result = await redis.eval(
            script,
            1,
            redisKey,
            maxUploads,
            ttl,
            expireAfterFirst
        );

        if (result === -1) {
            return c.json({ error: "Upload limit reached for this link." }, 403);
        }

        if (result === -2) {
            return c.json({ error: "This link has expired after one upload." }, 403);
        }


        const { uploadCount } = await LinkRepository.getInstance().findLinkUploadCount(link.id)
        if (uploadCount >= maxUploads) {
            return c.json({ error: "Upload limit reached for this link." }, 403);
        }

        c.set('mimeType', mimeType)

        return await next();
    } catch (error) {
        console.error("Error in validateLinkAccess:", error);
        return c.json({ error: "Internal Server Error in validateLinkAccess" }, 500);
    }
};







{/*
    old code 
    validateLinkAccess = async (ctx: Context, next) => {
        try {
            const link = ctx.get("link");

            const redisKey = `upload:count:${link.id}`

            let uploadCount: number | null = null
            const cachedCount = await redis.get(redisKey);

            if (cachedCount !== null) {
                const cachedCountStr = cachedCount.toString()
                uploadCount = parseInt(cachedCountStr);
            }
            else {
                const dbLink = await this.linkRepository.findLinkUploadCount(link.id)

                uploadCount = dbLink?.uploadCount ?? 0;
                // await redis.setx
                await redis.setex(redisKey, 60, uploadCount.toString()); // cache for 60 seconds
            }

            if (uploadCount >= link.maxUploads) {
                return ctx.json({ error: "Upload limit reached for this link." }, 403);
            }

            return await next();
        } catch (error) {
            console.error("Error in validateLinkAccess:", error);
            return ctx.json({ error: "Internal Server Error in validateLinkAccess" }, 500);
        }
    };
    
    */}