import { Context, Hono } from "hono";
import { fileController, middleware } from "../../../../server.conf";




export const fileRouter = new Hono()
    .get(
        '/:id/:token/files',
        middleware.fetchFilesByTokenMiddleware,
        fileController.getFilesByLinkToken
    )
    .get(
        '/storage-used',
        middleware.fetchUser,
        fileController.storeageUsed
    )

    // to get download s3 presigned url
    .get("/signed-url", middleware.fetchUser, fileController.getDownloadPresignedUrl)

    // to get post s3 upload presigned url for uploading
    .post(
        '/upload-url',
        middleware.UploadRateLimit,
        middleware.validateToken,
        middleware.validateLinkAccessM,
        fileController.getUploadPresignedUrl
    )
    // to notify file has uploaded to s3 and save meta data to db
    .post(
        "/notify-upload",
        middleware.validateToken,
        // middleware.validateLinkAccess,
        fileController.notifyFileUpload
    )
    .post('/stream', (c: Context) => {
        return c.text('got stream')
    })