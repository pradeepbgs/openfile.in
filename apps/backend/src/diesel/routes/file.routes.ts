import { Diesel } from "diesel-core";
import { diesel_file_controller, dieselMiddleware } from "../../../server.conf";




export const diesel_file_router = new Diesel({ logger: true, errorFormat: 'json' })
    // .get(
    //     '/:id/:token/files',
    //     dieselMiddleware.fetchFilesByTokenMiddleware,
    //     fileController.getFilesByLinkToken
    // )
    // .get(
    //     '/storage-used',
    //     middleware.fetchUser,
    //     fileController.storeageUsed
    // )

    // to get download s3 presigned url
    // .get("/signed-url", dieselMiddleware.fetchUser, fileController.getDownloadPresignedUrl)

    // to get post s3 upload presigned url for uploading
    .post(
        '/',
        dieselMiddleware.UploadRateLimit,
        dieselMiddleware.validateToken,
        dieselMiddleware.validateLinkAccess,
        diesel_file_controller.getUploadPresignedUrl
    )
// to notify file has uploaded to s3 and save meta data to db
// .post(
//     "/notify-upload",
//     middleware.validateToken,
//     // middleware.validateLinkAccess,
//     fileController.notifyFileUpload
// )
// .post('/stream', (c: Context) => {
//     return c.text('got stream')
// })

