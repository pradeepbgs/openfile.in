import { Diesel } from 'diesel-core'
import { diesel_file_controller, dieselMiddleware } from '@/container'

export const diesel_file_router = new Diesel({ logger: true, errorFormat: 'json' })

diesel_file_router
    .get('/:id/:token/files', dieselMiddleware.fetchFilesByTokenMiddleware, diesel_file_controller.getFilesByLinkToken)
    .get('/storage-used', dieselMiddleware.fetchUser, diesel_file_controller.storeageUsed)
    .get('/signed-url', dieselMiddleware.fetchUser, diesel_file_controller.getDownloadPresignedUrl)
    .post(
        '/upload-url',
        dieselMiddleware.UploadRateLimit,
        dieselMiddleware.validateToken,
        dieselMiddleware.validateLinkAccess,
        diesel_file_controller.getUploadPresignedUrl
    )
    .post('/notify-upload', dieselMiddleware.validateToken, diesel_file_controller.notifyFileUpload)
    .delete('/:id/files/:file_id', dieselMiddleware.fetchUser, diesel_file_controller.deleteFileFromLink)
