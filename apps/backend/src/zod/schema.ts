import { z } from 'zod';

export const authSchema = z.object({
    token: z.string().min(1, 'Access token is required'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(4, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
})

export const createLinkSchema = z.object({
    maxUploads: z.number().min(1),
    allowedFileType: z.array(z.string()).optional(),
    expiresAt: z.string().datetime(),
    name: z.string().optional(),
    expireAfterFirstUpload: z.boolean().optional().default(false)
})


export const secretKeySchema = z.object({
    secretKey: z.string().min(4, "Secret key is required")
});


export const fileSchema = z
    .custom((file) => file instanceof File)
    .refine((file: File) => {
        const mime = file.type
        return mime.startsWith("image/") || mime.startsWith("video/")
    }, {
        message: "Only image and video files are allowed."
    })

export const uploadRequestSchema = z.object({
    mimeType: z.string().optional().default('application/octet-stream'),
    fileSize: z.number({
        required_error: "File size is required.",
        invalid_type_error: "File size must be a number."
    }).positive("File size must be greater than zero.")
})

export const notifyUploadSchema = z.object({
    s3Key: z.string().min(1, 's3Key required'),
    fileSize: z.number({
        required_error: "File size is required.",
        invalid_type_error: "File size must be a number."
    }).positive("File size must be greater than zero."),
    name: z.string().optional(),
})

// export const downloadPreSignedRequestSchema = z.object({
//     token: z.string(),
//     s3key: z.string(),
//     fileId: z.coerce.number()
// })