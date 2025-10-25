import { links } from "../db";
import ApiResponse from "../utils/apiRespone";

export interface IFileService {
    notifyUpload(link: typeof links, { s3Key, fileSize, name }): Promise<ApiResponse>
    uploadPreSignedUrl(mimeType: string): Promise<ApiResponse>;
    getDownloadPreSignedUrl(userId: number, token: string, fileId: number, s3key: string): Promise<ApiResponse>;
    storageUsed(userId: number): Promise<ApiResponse>
    getFilesByLinkAndToken(token: string, userId: number, page: number, limit: number, skip: number): Promise<ApiResponse>
}

export interface IFileRepo {
    getUser(id: number): Promise<{ id: number } | null>

    findLinkByTokenAndUserId(token: string, userId: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        token: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        expireAfterFirstUpload: boolean;
        userId: number;
    } | null>

    findFileByIdUserIdAndLinkId(fileId: number, userId: number, linkId: number): Promise<{
        name: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        size: bigint;
        keyUsed: boolean;
        uploadLinkId: number;
    }>

    storageUsed(userId: number)

    createFileAndUpdateLink({ url, name, size }, linkId: number, userId: number):
        Promise<[{
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            url: string;
            size: bigint;
            keyUsed: boolean;
            uploadLinkId: number;
        }, {
            name: string;
            id: number;
            token: string;
            maxUploads: number;
            uploadCount: number;
            expiresAt: Date;
            expireAfterFirstUpload: boolean;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
        }]>

    getFiles(linkId: number, userId: number, skip: number, limit: number): Promise<{
        url: string;
        name: string;
        size: bigint;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        keyUsed: boolean;
        uploadLinkId: number;
    }[]>
}