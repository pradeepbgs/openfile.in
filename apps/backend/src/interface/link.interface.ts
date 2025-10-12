import { ApiError } from "../utils/apiError"
import ApiResponse from "../utils/apiRespone"


export interface ILinkRepo {
    findLinkByIdAndUser(linkId: number, userId: number)

    findLinkByTokenAndUserId(token: string, userId: number)

    findLinkByToken(token: string)

    FindLinkWithTokenIvAndKey(token: string)

    findFilesForLink(linkId: number, userId: number)

    deleteFilesForLink(linkId: number, userId: number)

    deleteLink(linkId: number, userId: number)

    delete_link_by_id(id: number)

    findLinkWithFilesByTokenAndUserId(linkId: number, token: string, userId: number, skip: number, limit: number)


    findUserLinks(userId: number, query: string, skip: number, limit: number)

    findLinkUploadCount(linkId: number)

    FindUserLinksCount(userId: number)

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
    )

    expired_link_count()

    find_expired_links(limit: number, offset: number)
}



export interface ILinkService {
    GenerateLinkForUpload(user, body): Promise<ApiResponse | ApiError>

    validateLink(token: string): Promise<boolean>

    deleteLink(link: any, userId: number): Promise<ApiResponse | ApiError>

    getLinksCount(userId: number): Promise<ApiResponse | ApiError>
}