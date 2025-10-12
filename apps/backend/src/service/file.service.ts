import { redis } from "../config/redis";
import { Link } from "../generated/prisma";
import { ApiError } from "../utils/apiError";
import ApiResponse from "../utils/apiRespone";
import { IFileRepo, IFileService } from "../interface/file.interface";
import { IStorage } from "../interface/storage.interface";



export default class FileService implements IFileService {
    private static instance: FileService
    private fileRepository: IFileRepo
    private storageService: IStorage

    constructor(fileRepository: IFileRepo, storageService: IStorage) {
        this.fileRepository = fileRepository
        this.storageService = storageService
    }

    static getInstance(fileRepository: IFileRepo, storageService: IStorage) {
        if (!FileService.instance) {
            FileService.instance = new FileService(fileRepository, storageService)
        }
        return FileService.instance;
    }

    notifyUpload = async (link: Link, { s3Key, fileSize, name }) => {

        const user = await this.fileRepository.getUser(link.userId);
        if (!user) {
            throw new ApiError('User not found', 404)
        }

        const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        const [fileRes, linkRes] = await this.fileRepository.createFileAndUpdateLink(
            {
                name,
                size: fileSize,
                url
            },
            link.id,
            user.id
        )

        if (!fileRes || !linkRes) {
            throw new ApiError("Partial failure updating DB.", 500)
        }

        return new ApiResponse(201, 'File metadata stored and link updated.', {});
    }


    uploadPreSignedUrl = async (mimeType: string) => {
        const { url, key } = await this.storageService.generatePresignedUploadUrl(mimeType);
        return new ApiResponse(200, 'URL generated successfully', { url, key })
    }

    getDownloadPreSignedUrl = async (userId: number, token: string, fileId: number, s3key: string) => {
        const link = await this.fileRepository.findLinkByTokenAndUserId(token, userId);
        if (!link) {
            throw new ApiError("Invalid link or unauthorized", 404);
        }

        const file = await this.fileRepository.findFileByIdUserIdAndLinkId(fileId, userId, link.id);
        if (!file) {
            throw new ApiError("File not found or unauthorized", 404);
        }

        const cacheKey = `signed-url:${userId}:${fileId}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            const cachedStr = cached.toString();
            const { url } = JSON.parse(cachedStr);
            return new ApiResponse(200, 'URL generated successfully', { url })
        }

        const url = await this.storageService.generateSignedDownloadUrl(s3key);
        await redis.set(cacheKey, JSON.stringify({ url }), "EX", 3600);

        return new ApiResponse(200, 'URL generated successfully', { url })
    }

    storageUsed = async (userId: number) => {
        const storageUsed = await this.fileRepository.storageUsed(userId);
        if (!storageUsed) throw new ApiError('Failed to get storage used', 500);

        return new ApiResponse(200, 'Storage used fetched successfully', { storageUsed: Number(storageUsed._sum.size) });
    }

    getFilesByLinkAndToken = async (token: string, userId: number, page: number, limit: number, skip: number) => {
        const link = await this.fileRepository.findLinkByTokenAndUserId(token, userId);

        if (!link) {
            throw new ApiError("Link not found or Unauthorized", 404);
        }

        const files = await this.fileRepository.getFiles(link.id, userId, skip, limit);

        if (!files) {
            throw new ApiError("No files found or Unauthorized", 404);
        }

        const safeFiles = files.map(file => ({
            ...file,
            size: Number(file.size),
        }));

        return new ApiResponse(
            200,
            'Files fetched successfully',
            {
                files: safeFiles,
                pagination: {
                    page,
                    limit,
                },
            }
        );
    }
}