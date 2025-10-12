import { Context } from "hono";
import { ApiError } from "./apiError";
import { ContextType } from "diesel-core";

export function handleErrorResponse(c: Context | ContextType, error: unknown) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, status);
}