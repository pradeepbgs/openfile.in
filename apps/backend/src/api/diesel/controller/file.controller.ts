import { ContextType } from "diesel-core";
import { IFileService } from "../../../interface/file.interface";
import { handleErrorResponse } from "../../../utils/handle-error";
import ApiResponse from "../../../utils/apiRespone";
import { notifyUploadSchema } from "../../../zod/schema";
import { Link, User } from "../../../generated/prisma";
import { HTTPException } from "diesel-core/http-exception";



export default class DieselFileController {
    private static instance: DieselFileController
    private fileService: IFileService

    constructor(fileService: IFileService) {
        this.fileService = fileService
    }

    static getInstance(fileService: IFileService) {
        if (!DieselFileController.instance) {
            DieselFileController.instance = new DieselFileController(fileService)
        }
        return DieselFileController.instance;
    }


    getFilesByLinkToken = async (c: ContextType) => {
        const files: any = c.get("files");
        const { page, limit }: any = c.get("pagination");

        const safeFiles = files.map(file => ({
            ...file,
            size: Number(file.size),
        }));
        try {
            return c.json({
                message: "Files fetched successfully",
                success: true,
                data: safeFiles,
                page,
                limit
            }, 200);
        } catch (error) {
            console.error("Error fetching files:", error);
            return handleErrorResponse(c, error)
        }
    }

    notifyFileUpload = async (c: ContextType) => {
        try {
            const link: Link = c.get('link')

            const body = await c.req.json();
            const parsed = notifyUploadSchema.safeParse(body)
            if (!parsed.success) {
                return c.json({ error: parsed.error.format() }, 400);
            }

            const { s3Key, fileSize, name } = parsed.data
            if (!s3Key || !fileSize) {
                return c.json({ error: 'Missing required fields' }, 400);
            }

            const ip = 'getConnInfo(c)' as any
            const apiResponse: ApiResponse = await this.fileService.notifyUpload(link, { s3Key, fileSize, name }, ip)
            return c.json({ message: apiResponse.message }, apiResponse.statusCode)
        } catch (error) {
            console.error("notifyFileUpload error:", error);
            return handleErrorResponse(c, error)
        }
    };


    getUploadPresignedUrl = async (c: ContextType) => {
        try {
            const safeMimeType: string = c.get('mimeType')

            const res: ApiResponse = await this.fileService.uploadPreSignedUrl(safeMimeType)
            return c.json(res.data, res.statusCode);
        } catch (error) {
            // console.log('upload url error ', error)
            throw new HTTPException(500, {
                message: "Internal Server Error in getUploadPresignedUrl",
            })
        }
    }

    getDownloadPresignedUrl = async (c: ContextType) => {
        const token = c.req.query('token');
        const fileIdRaw = c.req.query('fileId');
        const fileId = Number(fileIdRaw);
        const s3key = c.req.query('s3key');

        if (!token || !s3key || isNaN(fileId)) {
            return c.json({ error: "Missing or invalid parameters" }, 400);
        }
        const user: User = c.get('user')
        try {
            const apiRespone: ApiResponse = await this.fileService.getDownloadPreSignedUrl(user.id, token, fileId, s3key)

            return c.json(apiRespone, apiRespone.statusCode);
        } catch (error) {
            console.error("Signed URL error:", error);
            
            return handleErrorResponse(c, error)
        }
    }

    storeageUsed = async (c: ContextType) => {
        try {
            const user: User = c.get('user')
            const apiRespone = await this.fileService.storageUsed(user.id)

            return c.json(apiRespone, apiRespone.statusCode);
        } catch (error) {
            console.error("storage used error:", error);
            return handleErrorResponse(c, error)
        }
    }

}