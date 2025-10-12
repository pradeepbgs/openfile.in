import { Context } from "hono";

export const asyncHandler = (fn) => async (ctx: Context) => {
    try {
        await fn(ctx)
    } catch (error: any) {
        console.log("error", error);
        return ctx.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, error?.code ?? 500)
    }
}