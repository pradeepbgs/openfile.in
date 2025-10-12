import { Link } from "../generated/prisma";
import ApiResponse from "../utils/apiRespone";

export interface IFileService {
    notifyUpload(link: Link, { s3Key, fileSize, name }): Promise<ApiResponse>
    uploadPreSignedUrl(mimeType: string): Promise<ApiResponse>;
    getDownloadPreSignedUrl(userId: number, token: string, fileId: number, s3key: string): Promise<ApiResponse>;
    storageUsed(userId: number): Promise<ApiResponse>
    getFilesByLinkAndToken(token: string, userId: number, page: number, limit: number, skip: number): Promise<ApiResponse>
}

export interface IFileRepo {
    getUser(id: number): Promise<{ id: number } | null>

    findLinkByTokenAndUserId(token: string, userId: number)

    findFileByIdUserIdAndLinkId(fileId: number, userId: number, linkId: number)

    storageUsed(userId: number)

    createFileAndUpdateLink({ url, name, size }, linkId: number, userId: number)

    getFiles(linkId: number, userId: number, skip: number, limit: number)
}