

export interface IDeleteFileRepo {
    createMany(files: any, linkId: string)
    findExpiredLinkCount(type: 'PENDING' | 'DELETED' | 'FAILED'): Promise<number>
    findExpiredFiles(
        type: 'PENDING' | 'DELETED' | 'FAILED', limit: number, offset: number
    ): Promise<{ linkId: number, fileUrl: string, fileId: number }[]>
}

export interface IDeleteFileService {

}