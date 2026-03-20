import { links } from "../db";
import { ApiError } from "../utils/apiError"
import ApiResponse from "../utils/apiRespone"

export type Link = typeof links.$inferSelect

export interface ILinkRepo {
    findLinkByIdAndUser(linkId: number, userId: number): Promise<{
        token: string;
        id: number;
        files: {
            id: number;
            url: string;
        }[];
    }>

    findLinkByTokenAndUserId(token: string, userId: number): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: number;
        id: number;
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
        userId: number;
        id: number;
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
        userId: number;
        id: number;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    findFilesForLink(linkId: number, userId: number): Promise<{
        name: string;
        userId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        size: bigint;
        keyUsed: boolean;
        uploadLinkId: number;
    }[]>

    deleteFilesForLink(linkId: number, userId: number)

    deleteLink(linkId: number, userId: number): Promise<{
        token: string;
        expireAfterFirstUpload: boolean;
        name: string;
        userId: number;
        id: number;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>

    delete_link_by_id(id: number): Promise<{
        id: number;
        token: string;
        name: string;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        expireAfterFirstUpload: boolean;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>

    findLinkWithFilesByTokenAndUserId(linkId: number, token: string, userId: number, skip: number, limit: number): Promise<{
        id: number;
        files: {
            name: string;
            id: number;
            createdAt: Date;
            url: string;
            size: bigint;
        }[];
    }>


    findUserLinks(userId: number, query: string, skip: number, limit: number): Promise<{
        token: string;
        name: string;
        id: number;
        maxUploads: number;
        uploadCount: number;
        expiresAt: Date;
        createdAt: Date;
    }[]>

    findLinkUploadCount(linkId: number): Promise<{
        uploadCount: number;
    }>

    FindUserLinksCount(userId: number): Promise<number>

    createLink(
        {
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
                finalMaxUploads: number
                token: string
                finalExpiration: Date | string
                userId: number
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
            userId: number;
            id: number;
            maxUploads: number;
            uploadCount: number;
            expiresAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }, {
            name: string;
            id: number;
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
                userId: number;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                url: string;
                size: bigint;
                keyUsed: boolean;
                uploadLinkId: number;
            }[];
        } & {
            token: string;
            expireAfterFirstUpload: boolean;
            name: string;
            userId: number;
            id: number;
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

    deleteLink(link: any, userId: number): Promise<ApiResponse | ApiError>

    getLinksCount(userId: number): Promise<ApiResponse | ApiError>
}