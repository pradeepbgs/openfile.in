import { ConnInfo } from "hono/conninfo"
import { Link } from "../../generated/prisma"
import { IFileRepo, IFileService } from "../../interface/file.interface"
import { IStorage } from "../../interface/storage.interface"
import ApiResponse from "../../utils/apiRespone"



export default class DieselFileService implements IFileService {
    private static instance: DieselFileService
    private fileRepository: IFileRepo
    private storageService: IStorage

    constructor(fileRepository: IFileRepo, storageService: IStorage) {
        this.fileRepository = fileRepository
        this.storageService = storageService
    }

    static getInstance(fileRepository: IFileRepo, storageService: IStorage) {
        if (!DieselFileService.instance) {
            DieselFileService.instance = new DieselFileService(fileRepository, storageService)
        }
        return DieselFileService.instance;
    }


    uploadPreSignedUrl = async (mimeType: string) => {
        const { url, key } = await this.storageService.generatePresignedUploadUrl(mimeType);
        return new ApiResponse(200, 'URL generated successfully', { url, key })
    }

    getDownloadPreSignedUrl(userId: number, token: string, fileId: number, s3key: string): Promise<ApiResponse> {
        return '' as any

    }

    getFilesByLinkAndToken(token: string, userId: number, page: number, limit: number, skip: number): Promise<ApiResponse> {
        return '' as any

    }

    notifyUpload(link: Link, { s3Key, fileSize, name }: { s3Key: any; fileSize: any; name: any }, ip: ConnInfo): Promise<ApiResponse> {
        return '' as any

    }

    storageUsed(userId: number): Promise<ApiResponse> {
        return '' as any
    }


}