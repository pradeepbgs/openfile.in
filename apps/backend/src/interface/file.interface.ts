import { links } from "../db";
import ApiResponse from "../utils/apiRespone";
import { Link } from "./link.interface";

export interface IFileService {
    notifyUpload(link: Link, { s3Key, fileSize, name }): Promise<ApiResponse>
    uploadPreSignedUrl(mimeType: string): Promise<ApiResponse>;
    getDownloadPreSignedUrl(userId: string, token: string, fileId: string, s3key: string): Promise<ApiResponse>;
    storageUsed(userId: string): Promise<ApiResponse>
    getFilesByLinkAndToken(token: string, userId: string, page: number, limit: number, skip: number): Promise<ApiResponse>
    delete_a_file_from_a_link(link_id: string, file_id: string, user_id: string): Promise<ApiResponse>
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

    createFileAndUpdateLink({ linkId, userId, url, name, size }: { linkId: string, userId: string, url: string, name: string, size: bigint }):
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

    get_file_by_id(id: string): Promise<{
        userId: string;
        url: string;
        name: string;
        size: bigint;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        keyUsed: boolean;
        uploadLinkId: string;
    } | undefined>

    get_file_by_id_and_userid(file_id:string, user_id:string):Promise<{
    userId: string;
    url: string;
    name: string;
    size: bigint;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    keyUsed: boolean;
    uploadLinkId: string;
} | undefined>


    delete_file_from_link(file_id: string, link_id: string, user_id: string): Promise<{
        userId: string;
        url: string;
        name: string;
        size: bigint;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        keyUsed: boolean;
        uploadLinkId: string;
    } | null>
}
