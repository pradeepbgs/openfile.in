import { ApiError } from "../utils/apiError"
import ApiResponse from "../utils/apiRespone"


export interface ILinkRepo {
    findLinkByIdAndUser(linkId: string, userId: string): Promise<{
        token: string;
        id: string;
        files: {
            id: string;
            url: string;
        }[];
    }>

    findLinkByTokenAndUserId(token: string, userId: string): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: string;
        id: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    findLinkByToken(token: string): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: string;
        id: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    FindLinkWithTokenIvAndKey(token: string): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: string;
        id: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    findFilesForLink(linkId: string, userId: string): Promise<{
        name: string;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        size: bigint;
        keyUsed: boolean;
        uploadLinkId: string;
    }[]>

    deleteFilesForLink(linkId: string, userId: string)

    deleteLink(linkId: string, userId: string): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: string;
        id: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    delete_link_by_id(id: string): Promise<{
        id: string;
        token: string;
        name: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        expireAfterFirstUpload: boolean;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>

    findLinkWithFilesByTokenAndUserId(linkId: string, token: string, userId: string, skip: number, limit: number): Promise<{
        id: string;
        files: {
            name: string;
            id: string;
            createdAt: Date;
            url: string;
            size: bigint;
        }[];
    }>


    findUserLinks(userId: string, query: string, skip: number, limit: number): Promise<{
        token: string;
        name: string;
        id: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
    }[]>

    findLinkUploadCount(linkId: string): Promise<{
        uploadCount: number;
    }>

    FindUserLinksCount(userId: string): Promise<number>

    createLink(
        {
            id,
            finalMaxUploads,
            token,
            expireAfterFirstUpload,
            finalExpiration,
            name,
            userId,
            shouldResetLinkCountExpiration,
            now,
            linkCountexpireAt
        }
            : {
                id: string
                finalMaxUploads: number
                token: string
                finalExpiration: Date | string
                userId: string
                name: string
                expireAfterFirstUpload: boolean
                shouldResetLinkCountExpiration: boolean
                now: Date
                linkCountexpireAt: Date
            }
    ):
        Promise<[{
            token: string;
            expireAfterFirstUpload: boolean;
            name: string;
            userId: string;
            id: string;
            maxUploads: number;
            uploadCount: number;
            expiresAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }, {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            avatar: string;
            linkCount: number;
            linkCountExpireAt: Date;
        } | null]>

    expired_link_count(): Promise<number>

    find_expired_links(limit: number, offset: number):
        Promise<({
            files: {
                name: string;
                userId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                url: string;
                size: bigint;
                keyUsed: boolean;
                uploadLinkId: string;
            }[];
        } & {
            token: string;
            expireAfterFirstUpload: boolean;
            name: string;
            userId: string;
            id: string;
            maxUploads: number;
            uploadCount: number;
            expiresAt: Date;
            createdAt: Date;
            updatedAt: Date;
        })[]>

}



export interface ILinkService {
    GenerateLinkForUpload(user, body): Promise<ApiResponse | ApiError>

    validateLink(token: string): Promise<boolean>

    deleteLink(link: any, userId: string): Promise<ApiResponse | ApiError>

    getLinksCount(userId: string): Promise<ApiResponse | ApiError>
}