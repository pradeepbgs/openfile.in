import { links } from "../db";
import ApiResponse from "../utils/apiRespone";

export interface IFileService {
    notifyUpload(link: typeof links.$inferSelect, { s3Key, fileSize, name }): Promise<ApiResponse>
    uploadPreSignedUrl(mimeType: string): Promise<ApiResponse>;
    getDownloadPreSignedUrl(userId: string, token: string, fileId: string, s3key: string): Promise<ApiResponse>;
    storageUsed(userId: string): Promise<ApiResponse>
    getFilesByLinkAndToken(token: string, userId: string, page: number, limit: number, skip: number): Promise<ApiResponse>
}

export interface IFileRepo {
    getUser(id: string): Promise<{ id: string } | null>

    findLinkByTokenAndUserId(token: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        expireAfterFirstUpload: boolean;
        userId: string;
    } | null>

    findFileByIdUserIdAndLinkId(fileId: string, userId: string, linkId: string): Promise<{
        name: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        size: bigint;
        keyUsed: boolean;
        uploadLinkId: string;
    }>

    storageUsed(userId: string)

    createFileAndUpdateLink({ fileId, linkId, userId, url, name, size }: { fileId: string, linkId: string, userId: string, url: string, name: string, size: bigint }):
        Promise<[{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            size: bigint;
            keyUsed: boolean;
            uploadLinkId: string;
        }, {
            name: string;
            id: string;
            token: string;
            maxUploads: number;
            uploadCount: number;
            expiresAt: Date;
            expireAfterFirstUpload: boolean;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        }]>

    getFiles(linkId: string, userId: string, skip: number, limit: number): Promise<{
        url: string;
        name: string;
        size: bigint;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        keyUsed: boolean;
        uploadLinkId: string;
    }[]>
}