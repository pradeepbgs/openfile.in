import { ContentfulStatusCode } from "hono/utils/http-status";

export default class ApiResponse<T = any> {

    statusCode: ContentfulStatusCode;
    data: T;
    message: string;
    success: boolean;

    constructor(statusCode: ContentfulStatusCode, message: string = "Success", data: T) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

}