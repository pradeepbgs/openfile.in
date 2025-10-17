import { ContextType } from "diesel-core"
import { ICache } from "../../interface/cache.interface"
import { ILinkRepo } from "../../interface/link.interface"
import { IUserRepository } from "../../interface/user.interface"
import { HTTPException } from "diesel-core/http-exception"
import { verifyToken } from "../../utils/jwt"
import { calculateTTL, script } from "../../utils/helper"
import { redis } from "../../config/redis"
import { uploadRequestSchema } from "../../zod/schema"
import { Link } from "../../generated/prisma"
import { RATE_LIMIT, WINDOW } from "../../middlewarex/middleware"


export class DieselMiddlewares {
    private static instance: DieselMiddlewares
    private userRepository: IUserRepository
    private linkRepository: ILinkRepo
    private cache: ICache

    constructor(
        userRepository: IUserRepository,
        linkRepository: ILinkRepo,
        cache: ICache,
    ) {
        this.userRepository = userRepository,
            this.linkRepository = linkRepository,
            this.cache = cache
    }

    static getInstance(userRepository: IUserRepository, linkRepository: ILinkRepo, cache: ICache) {
        if (!this.instance) {
            this.instance = new DieselMiddlewares(userRepository, linkRepository, cache)
        }
        return DieselMiddlewares.instance
    }


    authJwt = async (c: ContextType) => {
        try {
            let token = c.req?.headers.get("Authorization") ?? c.cookies?.accessToken

            if (!token) {
                throw new HTTPException(401, {
                    message: "Unauthorized",
                    casue: "No token provided"
                });
            }

            const decoded = verifyToken(token)
            if (!decoded || !decoded.id) {
                throw new HTTPException(401, {
                    message: "Unauthorized",
                    casue: "Invalid token"
                });
            }


            const user = await this.userRepository.findUserAndPlanName(decoded.id as number)

            if (!user) {
                throw new HTTPException(401, {
                    message: "Unauthorized: User not found",
                });
            }

            c.set("user", user);
        } catch (error: any) {
            console.error("JWT verification error:", error?.message);
            let errMsg = "Invalid token";
            if (error.name === "TokenExpiredError") {
                errMsg = "Token expired";
            } else if (error.name === "JsonWebTokenError") {
                errMsg = "Malformed or tampered token";
            }

            if ((error).name === 'HTTPException') throw error;

            throw new HTTPException(401, {
                message: errMsg,
                cause: error?.message
                // res: c.json({ message: "Unauthorized", error: errMsg }, 401)
            });
        }
    }

    // 

    UploadRateLimit = async (c: ContextType): Promise<Response | void | any> => {
        try {
            // here we can make upload rate limit more better with using token as key so that a token can only hanlde 5 req/s 
            // but what if many users wants to upload at the same link token? it would be bad experience
            // mayb ewe can try ip+token so that each user can only make 5 req/s with his ip with the token
            let ip: string | null = null;
            const ipInfo: string | object | null = c.ip as any;
            if (ipInfo && typeof ipInfo === "object" && "address" in ipInfo) ip = ipInfo.address as any;
            else if (typeof ipInfo === "string") ip = ipInfo;

            const token = c.query.token
            const key = `upload:rate:${ip}:${token}`

            const current = Number(await redis.incr(key))
            if (current === 1) await redis.expire(key, WINDOW);

            c.setHeader('X-RateLimit-Limit', RATE_LIMIT.toString())
            c.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - current).toString())
            c.setHeader('X-RateLimit-Reset', (WINDOW).toString())

            if (current > RATE_LIMIT) {
                throw new HTTPException(429, {
                    message: "Too many requests. Try again later.",
                    cause: "Too many requests. Try again later."
                });
            }

            // do nothing.
            return;
        } catch (error: any) {
            if ((error).name === 'HTTPException') throw error;
            console.error("Internal error in UploadRateLimit:", error);
            throw new HTTPException(500, { message: "Internal Server Error in rate limit upload" });
        }
    }

    validateToken = async (ctx: ContextType): Promise<any> => {
        try {
            const token = ctx.query.token
            if (!token) throw new HTTPException(404, { message: "Token is required" });

            const link = await this.linkRepository.findLinkByToken(token);
            if (!link || new Date(link.expiresAt) < new Date()) {
                throw new HTTPException(404, { message: "Link not found or expired" });
            }

            ctx.set('link', link)

        } catch (error: any) {
            if ((error).name === 'HTTPException') throw error;
            console.error("Internal Server Error in validate token ", error);
            throw new HTTPException(500, { message: "Internal Server Error in validate token" });
        }
    }

    //

    validateLinkAccess = async (c: ContextType) => {
        try {
            const link: Link = c.get("link");
            if (!link) throw new HTTPException(400, { message: "Link not found in context" });


            const body = await c.body
            const parsed = uploadRequestSchema.safeParse(body);
            if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

            const { mimeType, fileSize } = parsed.data;
            const redisKey = `upload:count:${link.id}`;
            const maxUploads = link.maxUploads
            const ttl = calculateTTL(fileSize);
            const expireAfterFirst = link.expireAfterFirstUpload ? "1" : "0";

            let result: number;
            try {
                result = Number(await redis.eval(script, 1, redisKey, maxUploads, ttl, expireAfterFirst));
            } catch (err) {
                console.error("Redis error:", err);
                result = 0;
            }

            if (result === -1 || result === -2) {
                throw new HTTPException(403, {
                    message: "Unable to process upload at this time.",
                });
            }

            const { uploadCount } = await this.linkRepository.findLinkUploadCount(link.id)
            if (result === -1 || result === -2 || uploadCount >= maxUploads) {
                throw new HTTPException(403, {
                    message: "Unable to process upload at this time.",
                });
            }


            c.set('mimeType', mimeType)

        } catch (error) {
            if (error?.name === "HTTPException") throw error;
            console.error("validateLinkAccess error:", error);
            throw new HTTPException(500, {
                res: c.json({ error: "Internal Server Error in validateLinkAccess" }, 500)
            });
        }
    };


    // 


}