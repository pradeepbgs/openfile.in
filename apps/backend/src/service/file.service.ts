import { redis } from "../config/redis";
import { ApiError } from "../utils/apiError";
import ApiResponse from "../utils/apiRespone";
import { IFileRepo, IFileService } from "../interface/file.interface";
import { IStorage } from "../interface/storage.interface";
import { links } from "../db";
import { ILinkRepo, Link } from "../interface/link.interface";
import { IDeleteFileRepo } from "../interface/delete-file.interface";
import { deleteQueue } from "../queue/bullmq/queue/delete-files.queue";

export default class FileService implements IFileService {
    private static instance: FileService

    constructor(
        private fileRepository: IFileRepo,
        private storageService: IStorage,
        private link_repository: ILinkRepo,
        private deletedFileRepository: IDeleteFileRepo
    ) {}

    static getInstance(fileRepository: IFileRepo, storageService: IStorage, link_repository: ILinkRepo, deletedFileRepository: IDeleteFileRepo) {
        if (!FileService.instance) {
            FileService.instance = new FileService(fileRepository, storageService, link_repository, deletedFileRepository)
        }
        return FileService.instance;
    }

    notifyUpload = async (link: Link, { s3Key, fileSize, name }) => {

        const user = await this.fileRepository.getUser(link.userId);
        if (!user) {
            throw new ApiError('User not found', 404)
        }

        const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        console.log('userid', user)
        console.log('link ', link)
        const [fileRes, linkRes] = await this.fileRepository.createFileAndUpdateLink({
            linkId: link.id,
            userId: user.id,
            url,
            name,
            size: BigInt(fileSize),
        })

        if (!fileRes || !linkRes) {
            throw new ApiError("Partial failure updating DB.", 500)
        }

        return new ApiResponse(201, 'File metadata stored and link updated.', {});
    }


    uploadPreSignedUrl = async (mimeType: string) => {
        console.log('in file service before generate url')
        const { url, key } = await this.storageService.generatePresignedUploadUrl(mimeType);
        console.log('in file service after generate url')
        return new ApiResponse(200, 'URL generated successfully', { url, key })
    }

    getDownloadPreSignedUrl = async (userId: string, token: string, fileId: string, s3key: string) => {
        const link = await this.fileRepository.findLinkByTokenAndUserId(token, userId);
        if (!link) {
            throw new ApiError("Invalid link or unauthorized", 404);
        }

        const file = await this.fileRepository.findFileByIdUserIdAndLinkId(fileId, userId, link.id);
        if (!file) {
            throw new ApiError("File not found or unauthorized", 404);
        }

        const cacheKey = `signed-url:${fileId}`;
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

    storageUsed = async (userId: string) => {
        const storageUsed = await this.fileRepository.storageUsed(userId);
        if (!storageUsed) throw new ApiError('Failed to get storage used', 500);
        return new ApiResponse(200, 'Storage used fetched successfully', { storageUsed: Number(storageUsed.totalSize) });
    }

    getFilesByLinkAndToken = async (token: string, userId: string, page: number, limit: number, skip: number) => {
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

    delete_a_file_from_a_link = async (link_id: string, file_id: string, user_id: string) => {
        const link = await this.link_repository.findLinkByIdAndUser(link_id, user_id);
        if (!link) {
            throw new ApiError("Link is expired or doesn't exist.", 404);
        }
        const file = await this.fileRepository.get_file_by_id_and_userid(file_id, user_id);
        if (!file) {
            throw new ApiError("File doesn't exist or Unauthorized", 404);
        }

        if (file.uploadLinkId !== link.id) {
            throw new ApiError("Unauthorized", 403);
        }

        // 1. Create tracking record in deleted_files table so recovery worker can track status
        await this.deletedFileRepository.createMany([{ id: file.id, url: file.url }], link.id);

        // 2. Delete file row from files table (fail-safe: if DB delete fails, no S3 queue job is dispatched)
        const deleted = await this.fileRepository.delete_file_from_link(file.id, link.id, user_id);
        if (!deleted) {
            throw new ApiError("Failed to delete file.", 500);
        }

        // 3. Dispatch background worker job for S3 cleanup (if this fails, recovery worker will retry PENDING state)
        await deleteQueue.add('delete-queue', {
            linkId: link.id,
            files: [{ id: file.id, url: file.url }]
        });

        // 4. Safely clear redis cache
        redis.del(`signed-url:${file.id}`).catch((err) => {
            console.error(`Failed to delete redis cache for file ${file.id}:`, err);
        });

        return new ApiResponse(200, "File deleted successfully", {});
    }
}