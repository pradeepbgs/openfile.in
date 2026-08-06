import { Readable } from "stream"

export interface IStorage {
    name(): string
    
    uploadFile(file: File): Promise<{
        url: string;
        key: string;
    }>
    
    uploadStream(stream: Readable, contentType: string): Promise<{
        url: string;
        key: string;
    }>
    
    generateSignedDownloadUrl(key: string): Promise<string>
    
    generatePresignedUploadUrl(mimeType: string): Promise<{
        url: string;
        key: string;
    } | undefined>
    
    deleteFiles(files: { id: string, url: string }[]): Promise<boolean | undefined>
}


export function extractKeyFromUrl(url: string) {
    const parsed = new URL(url);
    return parsed.pathname.slice(1);
}