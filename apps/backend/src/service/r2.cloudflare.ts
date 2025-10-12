import { Readable } from "stream";
import { extractKeyFromUrl, IStorage } from "../interface/storage.interface";
import { DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getKey } from "../utils/helper";
import { Upload } from "@aws-sdk/lib-storage";


export class R2StorageService implements IStorage {
    private client: any;
    private bucket: string;

    private static instance: R2StorageService
    Instancename: string

    constructor(bucket: string, accountId: string, accessKey: string, secretKey: string) {
        this.client = new S3Client({
            region: "auto",  // cloudflare needs auto
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
        });
        this.bucket = bucket;
        this.Instancename = 'r2'
    }

    public static getInstance(bucket: string, accountId: string, accessKey: string, secretKey: string) {
        if (!R2StorageService.instance) {
            R2StorageService.instance = new R2StorageService(bucket, accountId, accessKey, secretKey)
        }
        return R2StorageService.instance
    }

    name(): string {
        return this.Instancename
    }

    async generateSignedDownloadUrl(key: string) {
        const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key })
        return await getSignedUrl(this.client, cmd, { expiresIn: 3600 })
    }

    async generatePresignedUploadUrl(mimeType: string) {
        const key = getKey(mimeType);
        const cmd = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: mimeType,
        });
        const url = await getSignedUrl(this.client as any, cmd, { expiresIn: 3600 });
        return { url, key };
    }

    async uploadFile(file: File, userId: number) {
        const key = getKey(file.type);
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: file,
                ContentType: file.type,
            },
        });
        await upload.done();
        const url = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { url, key };
    }

    async uploadStream(stream: Readable, contentType: string, userId: number) {
        const key = getKey(contentType);
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: stream,
                ContentType: contentType,
            },
        });
        await upload.done();
        const url = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { url, key };
    }

    async deleteFiles(files: { id: number, url: string }[]) {
        // console.log("called r2 delete ", this.name())
        // console.log(files)

        if (files.length === 0) return;

        const objects = files.map((f) => ({
            Key: extractKeyFromUrl(f.url),
        }));

        try {
            const res = await this.client.send(
                new DeleteObjectsCommand({
                    Bucket: this.bucket,
                    Delete: { Objects: objects },
                })
            );

            if (res.Errors && res.Errors.length > 0) {
                console.warn("S3 deletion errors:", res.Errors);
                return false;
            }
            return true;
        } catch (error) {
            console.log("error while deleting files from R2", error);
            return false;
        }
    }

}