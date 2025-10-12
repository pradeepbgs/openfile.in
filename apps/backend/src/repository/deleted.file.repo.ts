import { prisma } from "../config/db";
import { IDeleteFileRepo } from "../interface/delete-file.interface";


export class DeletedFileRepository implements IDeleteFileRepo {
    private static instance: DeletedFileRepository

    constructor() { }

    static getInstance() {
        if (!DeletedFileRepository.instance) {
            DeletedFileRepository.instance = new DeletedFileRepository();
        }
        return DeletedFileRepository.instance
    }

    async createMany(files: any, linkId: number) {
        return await prisma.deletedFile.createMany({
            data: files.map((file) => ({
                fileId: file.id,
                linkId,
                fileUrl: file.url,
                status: 'PENDING',
            }))
        })
    }

}