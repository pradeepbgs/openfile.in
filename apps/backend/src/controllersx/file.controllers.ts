import { Context } from "hono";
import ApiResponse from '../utils/apiRespone'
import { handleErrorResponse } from '../utils/handle-error'
import { User } from "../generated/prisma";
import { notifyUploadSchema } from "../zod/schema";
import { IFileService } from "../interface/file.interface";

export default class FileController {
    private static instance: FileController
    private fileService: IFileService

    constructor(fileService: IFileService) {
        this.fileService = fileService
    }

    static getInstance(fileService: IFileService) {
        if (!FileController.instance) {
            FileController.instance = new FileController(fileService)
        }
        return FileController.instance;
    }


    getFilesByLinkToken = async (c: Context) => {
        const files = c.get("files");
        const { page, limit } = c.get("pagination");

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

    notifyFileUpload = async (c: Context) => {
        try {
            const link = c.get('link')

            const body = await c.req.json();
            const parsed = notifyUploadSchema.safeParse(body)
            if (!parsed.success) {
                return c.json({ error: parsed.error.format() }, 400);
            }

            const { s3Key, fileSize, name } = parsed.data
            if (!s3Key || !fileSize) {
                return c.json({ error: 'Missing required fields' }, 400);
            }

            const apiResponse: ApiResponse = await this.fileService.notifyUpload(link, { s3Key, fileSize, name })
            return c.json({ message: apiResponse.message }, apiResponse.statusCode)
        } catch (error) {
            console.error("notifyFileUpload error:", error);
            return handleErrorResponse(c, error)
        }
    };


    getUploadPresignedUrl = async (c: Context) => {
        try {
            const safeMimeType = c.get('mimeType')

            const res: ApiResponse = await this.fileService.uploadPreSignedUrl(safeMimeType)
            return c.json(res.data, res.statusCode);
        } catch (error) {
            console.log('upload url error ', error)
            return c.json({ error: "Failed to generate URL" }, 500);
        }
    }

    getDownloadPresignedUrl = async (c: Context) => {
        const token = c.req.query('token');
        const fileIdRaw = c.req.query('fileId');
        const fileId = Number(fileIdRaw);
        const s3key = c.req.query('s3key');

        if (!token || !s3key || isNaN(fileId)) {
            return c.json({ error: "Missing or invalid parameters" }, 400);
        }
        const user = c.get('user')
        try {
            const apiRespone: ApiResponse = await this.fileService.getDownloadPreSignedUrl(user.id, token, fileId, s3key)

            return c.json(apiRespone, apiRespone.statusCode);
        } catch (error) {
            console.error("Signed URL error:", error);
            return handleErrorResponse(c, error)
        }
    }

    storeageUsed = async (c: Context) => {
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
