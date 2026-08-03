import { ApiError } from "./apiError";
import { Context } from "diesel-core";

type c = Context

export function handleErrorResponse(c: c, error: unknown) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, status);
}