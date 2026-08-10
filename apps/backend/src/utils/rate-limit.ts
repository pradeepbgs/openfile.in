import { HTTPException } from "diesel-core/http-exception";
import { ContextType } from "diesel-core";
import { redis } from "../config/redis";

export const getClientIp = (c: ContextType): string | null => {
    const ipInfo: string | object | null = c.ip as any;
    if (ipInfo && typeof ipInfo === "object" && "address" in ipInfo) return (ipInfo as any).address;
    if (typeof ipInfo === "string") return ipInfo;
    return null;
};

export const enforceRateLimit = async (key: string, limit: number, window: number): Promise<void> => {
    const current = Number(await redis.incr(key));
    if (current === 1) await redis.expire(key, window);

    if (current > limit) {
        throw new HTTPException(429, {
            message: "Too many requests. Try again later.",
            cause: "Too many requests. Try again later."
        });
    }
};
