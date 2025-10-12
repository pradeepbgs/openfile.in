import { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
    public statusCode: ContentfulStatusCode;

    constructor(message: string, statusCode:ContentfulStatusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}