import { Context } from "hono"
import { createLinkSchema } from "../zod/schema"
import { handleErrorResponse } from "../utils/handle-error"
import { ILinkService } from "../interface/link.interface"


export default class LinkController {
    private static instance: LinkController
    private linkService: ILinkService

    constructor(linkService: ILinkService) {
        this.linkService = linkService
    }

    static getInstance(linkService: ILinkService) {
        if (!LinkController.instance) {
            LinkController.instance = new LinkController(linkService)
        }
        return LinkController.instance;
    }

    generateLink = async (c: Context) => {

        try {
            const user = c.get('user')
            const body = await c.req.json()
            const result = createLinkSchema.safeParse(body)

            if (!result.success) {
                const message = result.error.errors[0].message
                return c.json({ error: message }, 400)
            }

            const apiResponse: any = await this.linkService.GenerateLinkForUpload(user, result.data)
            return c.json(apiResponse.data, apiResponse.statusCode);
        } catch (error) {
            console.error("Error generating link:", error);
            return handleErrorResponse(c, error)
        }
    }

    //
    getUserLinks = async (c: Context) => {
        try {
            const links = c.get("userLinks");
            const pagination = c.get("pagination");

            return c.json({
                message: "Links fetched successfully",
                success: true,
                data: links,
                page: pagination.page,
                limit: pagination.limit
            }, 200);
        } catch (error) {
            console.error("Error fetching user links:", error);
            return handleErrorResponse(c, error)
        }
    };

    // 
    validateLink = async (c: Context) => {
        try {
            const token = c.req.query("token");
            if (!token) return c.json({ error: "pls provide token" }, 404);

            await this.linkService.validateLink(token);
            return c.json({ message: "Link is valid" }, 200);
        } catch (error) {
            console.error("Error validating link:", error?.message);
            return handleErrorResponse(c, error)
        }
    };

    // 
    deleteLink = async (c: Context) => {
        try {
            const link = c.get("link");
            const userId = c.get("userId")
            const apiResponse: any = await this.linkService.deleteLink(link, userId);
            return c.json(apiResponse.message, apiResponse.statusCode);
        } catch (error) {
            console.error("Error deleting link:", error);
            return handleErrorResponse(c, error)
        }
    };

    // 
    getLinksCount = async (c: Context) => {
        try {
            const user = c.get("user")
            const apiResponse: any = await this.linkService.getLinksCount(user.id);
            return c.json(apiResponse.data, apiResponse.statusCode);
        } catch (error) {
            console.error("Error getting links count:", error);
            return handleErrorResponse(c, error)
        }
    }
}