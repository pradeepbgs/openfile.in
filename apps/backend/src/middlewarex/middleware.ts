import { Context, Next } from "hono"
import { getCookie } from "hono/cookie"
import { HTTPException } from 'hono/http-exception'
import { getConnInfo } from "hono/bun"
import { redis } from "../config/redis"
import { ILinkRepo } from "../interface/link.interface"
import { IUserRepository } from "../interface/user.interface"
import { calculateTTL, script } from "../utils/helper"
import { uploadRequestSchema } from "../zod/schema"
import { MiddlewareService } from "../service/middleware.service"
import { ApiError } from "../utils/apiError"

export const RATE_LIMIT = parseInt(process.env.UPLOAD_RATE_LIMIT) || 60
export const WINDOW = parseInt(process.env.UPLOAD_RATE_WINDOW) || 60

export class Middlewares {
    private static instance: Middlewares
    private userRepository: IUserRepository
    private linkRepository: ILinkRepo

    constructor(
        userRepository: IUserRepository,
        linkRepository: ILinkRepo,
    ) {
        this.userRepository = userRepository,
            this.linkRepository = linkRepository
    }

    static getInstance(
        userRepository: IUserRepository,
        linkRepository: ILinkRepo,
    ) {
        if (!this.instance) {
            this.instance = new Middlewares(userRepository, linkRepository)
        }
        return Middlewares.instance
    }

    authJwt = async (c: Context, next: Next): Promise<void | null | Response> => {
        try {
            let token = c.req?.header("Authorization") ?? getCookie(c, 'accessToken')
            const user = await MiddlewareService.verifyAuthToken(token);

            c.set("user", user);
            return await next()
        } catch (error: any) {
            console.error("Auth middleware error:", error?.message);
            if (error instanceof ApiError) {
                throw new HTTPException(error.statusCode, { message: error.message });
            }
            throw new HTTPException(401, { message: "Unauthorized" });
        }
    }

    // 
    fetchFilesByTokenMiddleware = async (c: Context, next: Next) => {
        try {
            let token = c.req.header("Authorization") ?? getCookie(c, "accessToken");
            if (!token) {
                throw new ApiError("No token provided", 401);
            }

            const linkToken = c.req.param("token");
            const linkId = Number(c.req.param('id'))
            if (!linkToken || !linkId) {
                throw new ApiError("Token param or linkId missing", 400);
            }

            const limit = parseInt(c.req.query("limit") || "10");
            const page = parseInt(c.req.query("page") || "1");

            const link = await MiddlewareService.fetchFilesByToken(token, linkId, linkToken, page, limit);

            c.set("files", link.files);
            c.set("pagination", { page, limit });

            return await next();
        } catch (err: any) {
            console.error("Error in fetchFilesByToken middleware:", err.message);
            if (err instanceof ApiError) {
                throw new HTTPException(err.statusCode, { message: err.message });
            }
            throw new HTTPException(500, { message: "Internal Server Error" });
        }
    };

    // 
    fetchLinkWithUser = async (c: Context, next: Next) => {
        try {
            let token = c.req?.header("Authorization") ?? getCookie(c, "accessToken");

            if (!token) throw new ApiError("No token provided", 401);

            const linkId = parseInt(c.req.param("id"));
            if (!linkId) {
                throw new ApiError("Invalid link ID", 400);
            }

            const { userId, link } = await MiddlewareService.fetchLinkWithUser(token, linkId);

            c.set("userId", userId);
            c.set("link", link);
            return await next();
        } catch (err: any) {
            console.error("Error in fetchLinkWithUser middleware:", err.message);
            if (err instanceof ApiError) {
                throw new HTTPException(err.statusCode, { message: err.message });
            }
            throw new HTTPException(500, { message: "Internal Server Error" });
        }
    };

    // 
    fetchUser = async (c: Context, next: Next) => {
        try {
            const token = c.req?.header("Authorization") ?? getCookie(c, 'accessToken')
            const user = await MiddlewareService.fetchUser(token);
            c.set('user', user)
            return await next()
        } catch (error: any) {
            console.log('error in fetch user from link id ', error?.message)

            if ((error).name === 'HTTPException') throw error;

            throw new HTTPException(500, { message: "Internal Server Error in fetchUser" });
        }
    }

    //
    fetchUserLinks = async (c: Context, next: Next) => {
        try {
            let token = c.req?.header("Authorization") ?? getCookie(c, "accessToken");

            if (!token) {
                throw new ApiError("No token provided", 401);
            }

            const query = c.req.query("query") || ""
            const limit = parseInt(c.req.query("limit") || "10");
            const page = parseInt(c.req.query("page") || "1");

            const { userId, links } = await MiddlewareService.fetchUserLinks(token, query, page, limit);

            if (!links || links.length === 0) {
                return c.json({ error: "No links found or unauthorized", data: [] }, 200);
            }

            c.set("userId", userId);
            c.set("userLinks", links);
            c.set("pagination", { limit, page });
            return await next();
        } catch (error: any) {
            console.error("Error in fetchLinkWithUser middleware:", error.message);
            if ((error).name === 'HTTPException') throw error;
            throw new HTTPException(500, { message: "Internal Server Error" });
        }
    };

    //
    UploadRateLimit = async (c: Context, next: Next) => {
        try {
            // here we can make upload rate limit more better with using token as key so that a token can only hanlde 5 req/s 
            // but what if many users wants to upload at the same link token? it would be bad experience
            // mayb ewe can try ip+token so that each user can only make 5 req/s with his ip with the token
            const info = getConnInfo(c)
            const ip = info.remote.address
            const token = c.req.query('token')
            const key = `upload:rate:${ip}:${token}`

            const current = Number(await redis.incr(key))
            if (current === 1) {
                await redis.expire(key, WINDOW)
            }

            c.header('X-RateLimit-Limit', RATE_LIMIT.toString())
            c.header('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - current).toString())
            c.header('X-RateLimit-Reset', (WINDOW).toString())

            if (current > RATE_LIMIT) {
                throw new HTTPException(429, {
                    res: c.json({ error: "Too many requests. Try again later." }, 429)
                });
            }

        } catch (error: any) {
            console.log(error)
            if ((error).name === 'HTTPException') throw error;
            throw new HTTPException(500, {
                res: c.json({ error: "Internal Server Error in rate limit upload" }, 500)
            });
        }
        return await next()
    }

    //
    validateLinkAccessM = async (c: Context, next) => {
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


            const { uploadCount } = await this.linkRepository.findLinkUploadCount(link.id)
            if (uploadCount >= maxUploads) {
                return c.json({ error: "Upload limit reached for this link." }, 403);
            }

            c.set('mimeType', mimeType)

            return await next();
        } catch (error) {
            console.error("Error in validateLinkAccess:", error);
            if ((error).name === 'HTTPException') throw error;

            return c.json({ error: "Internal Server Error in validateLinkAccess" }, 500);
        }
    };


    validateToken = async (ctx: Context, next: Next) => {
        try {
            const token = ctx.req.query('token')
            if (!token) {
                throw new HTTPException(404, {
                    res: ctx.json({ error: "pls provide token" }, 404)
                });
            }

            const link = await this.linkRepository.findLinkByToken(token)

            const now = new Date();
            if (!link || new Date(link.expiresAt) < now) {
                throw new HTTPException(404, {
                    res: ctx.json({ error: "Link doesn't exist or expired" }, 404)
                });
            }

            ctx.set('link', link)
            return await next()

        } catch (error: any) {
            console.log('Internal Server Error in validate token ', error)
            if ((error).name === 'HTTPException') throw error;

            throw new HTTPException(500, {
                res: ctx.json({ error: "Internal Server Error in validate token" }, 500)
            });
        }
    }
}
