import { Readable } from "stream"

export interface IStorage {
    name(): string
    uploadFile(file: File)
    uploadStream(stream: Readable, contentType: string)
    generateSignedDownloadUrl(key: string)
    generatePresignedUploadUrl(mimeType: string)
    deleteFiles(files: { id: string, url: string }[])
}


export function extractKeyFromUrl(url: string) {
    const parsed = new URL(url);
    return parsed.pathname.slice(1);
}