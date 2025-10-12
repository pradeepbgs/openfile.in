import { Readable } from "stream"

export interface IStorage {
    name(): string
    uploadFile(file: File, userId: number)
    uploadStream(stream: Readable, contentType: string, userId: number)
    generateSignedDownloadUrl(key: string)
    generatePresignedUploadUrl(mimeType: string)
    deleteFiles(files: { id: number, url: string }[])
}


export function extractKeyFromUrl(url: string) {
    const parsed = new URL(url);
    return parsed.pathname.slice(1);
}