import { ContextType } from 'diesel-core'
import { HTTPException } from 'diesel-core/http-exception'
import { ILinkService } from '../../../interface/link.interface'
import ApiResponse from '../../../utils/apiRespone'
import { handleErrorResponse } from '../../../utils/handle-error'
import { createLinkSchema } from '../../../zod/schema'

export default class DieselLinkController {
    private static instance: DieselLinkController
    private linkService: ILinkService

    constructor(linkService: ILinkService) {
        this.linkService = linkService
    }

    static getInstance(linkService: ILinkService) {
        if (!DieselLinkController.instance) {
            DieselLinkController.instance = new DieselLinkController(linkService)
        }
        return DieselLinkController.instance
    }

    generateLink = async (c: ContextType) => {
        try {
            const user = c.get('user')
            const body = await c.body
            const result = createLinkSchema.safeParse(body)
            if (!result.success) {
                const message = result.error.errors[0].message
                return c.json({ error: message }, 400)
            }
            const apiResponse: any = await this.linkService.GenerateLinkForUpload(user, result.data)
            return c.json(apiResponse.data, apiResponse.statusCode)
        } catch (error) {
            console.error('Error generating link:', error)
            return handleErrorResponse(c, error)
        }
    }

    getUserLinks = async (c: ContextType) => {
        try {
            const links = c.get('userLinks')
            const pagination: any = c.get('pagination')
            return c.json({
                message: 'Links fetched successfully',
                success: true,
                data: links,
                page: pagination.page,
                limit: pagination.limit,
            }, 200)
        } catch (error) {
            console.error('Error fetching user links:', error)
            return handleErrorResponse(c, error)
        }
    }

    validateLink = async (c: ContextType) => {
        try {
            const token = c.query.token
            if (!token) return c.json({ error: 'pls provide token' }, 404)
            await this.linkService.validateLink(token)
            return c.json({ message: 'Link is valid' }, 200)
        } catch (error) {
            console.error('Error validating link:', error)
            return handleErrorResponse(c, error)
        }
    }

    deleteLink = async (c: ContextType) => {
        try {
            const link = c.get('link')
            const userId = c.get('userId')
            const apiResponse: any = await this.linkService.deleteLink(link, userId as string)
            return c.json(apiResponse.message, apiResponse.statusCode)
        } catch (error) {
            console.error('Error deleting link:', error)
            return handleErrorResponse(c, error)
        }
    }

    getLinksCount = async (c: ContextType) => {
        try {
            const user: any = c.get('user')
            const apiResponse: any = await this.linkService.getLinksCount(user.id)
            return c.json(apiResponse.data, apiResponse.statusCode)
        } catch (error) {
            console.error('Error getting links count:', error)
            return handleErrorResponse(c, error)
        }
    }
}
