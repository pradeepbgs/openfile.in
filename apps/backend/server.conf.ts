import { CONFIG } from "./src/config";
import { createDBClient } from "./src/config/db";
import { AuthController } from "./src/controllers/auth.controller";
import FileController from "./src/controllers/file.controllers";
import LinkController from "./src/controllers/link.controller";
import { DieselAuthController } from "./src/diesel/controller/auth.controller";
import DieselFileController from "./src/diesel/controller/file.controller";
import { DieselMiddlewares } from "./src/diesel/middleware";
import { DieselAuthService } from "./src/diesel/service/auth.service";
import { PrismaClient } from "./src/generated/prisma";
import { ILinkRepo } from "./src/interface/link.interface";
import { IUserRepository } from "./src/interface/user.interface";
import { Middlewares } from "./src/middleware/middleware";
import { DeletedFileRepository } from "./src/repository/deleted.file.repo";
import { FileRepository } from "./src/repository/file.repo";
import { LinkRepository } from "./src/repository/link.repo";
import { SubscriptionRepository } from "./src/repository/subscription.repo";
import UserRepository from "./src/repository/user.repo";
import { AuthService } from "./src/service/auth.service";
import { RedisCache } from "./src/service/cache.service";
import CleanupService from "./src/service/cleanup.service";
import FileService from "./src/service/file.service";
import LinkService from "./src/service/link.service";
import { ResendMailService } from "./src/service/mail.service";
import NotificationService from "./src/service/notification.service";
import { R2StorageService } from "./src/service/r2.cloudflare";
import { S3Service } from "./src/service/s3.service";

// Select storage
function createStorageService() {
    const name = CONFIG.STORAGE_TYPE.toLowerCase();

    switch (name) {
        case 's3':
            return S3Service.getInstance();

        case 'r2':
        default:
            return R2StorageService.getInstance(
                CONFIG.CLOUDFLARE_BUCKET!,
                CONFIG.CLOUDFLARE_ACCOUNT_ID!,
                CONFIG.CLOUDFLARE_ACCESS_KEY!,
                CONFIG.CLOUDFLARE_SECRET_KEY!
            );
    }
}

function createMailer() {
    const type = process.env.MAILER_TYPE || "resend";
    switch (type.toLowerCase()) {
        case 'resend':
            return new ResendMailService()
        case "nodemailer":
        default:
            return new ResendMailService()
    }
}

function createCacheService() {
    const name = process.env.CACHE;
    switch (name) {
        case 'redis':
            return RedisCache.getInstance()

        default:
            return RedisCache.getInstance()
    }
}

type RepositoryName = 'link' | 'deleted_file' | 'user' | 'file' | 'subscription'

export function createRepository(repositoryName: RepositoryName)
    : ILinkRepo | IUserRepository | FileRepository | DeletedFileRepository | SubscriptionRepository {
    const clientType = CONFIG.DB_CLIENT;
    const client = createDBClient(clientType as any)

    switch (repositoryName) {
        case 'link':
            if (clientType === 'drizzle') return // will create drizzleRepo
            return LinkRepository.getInstance(client as PrismaClient);
        case 'deleted_file':
            if (clientType === 'drizzle') return
            return DeletedFileRepository.getInstance(client as PrismaClient);
        case 'user':
            if (clientType === 'drizzle') return
            return UserRepository.getInstance(client as PrismaClient);
        case 'file':
            if (clientType === 'drizzle') return
            return FileRepository.getInstance(client as PrismaClient);
        case 'subscription':
            if (clientType === 'drizzle') return
            return SubscriptionRepository.getInstance(client as PrismaClient);

        default:
            throw new Error(`Repository ${repositoryName} not found`);
    }
}

export const cacheService = createCacheService();

export const mailer = createMailer();
export const notificationService = NotificationService.getInstance(mailer);
// notificationService.sendWelcomeEmail('teamopenfile@gmail.com')

// Instances
export const storageService = createStorageService();

export const linkRepository = createRepository('link') as ILinkRepo
export const deletedFileRepository = createRepository('deleted_file') as DeletedFileRepository
export const userRepository = createRepository('user') as IUserRepository
export const fileRepository = createRepository('file') as FileRepository
export const subscriptionRepository = createRepository('subscription') as SubscriptionRepository


export const linkService = LinkService.getInstance(
    linkRepository,
    deletedFileRepository,
);

export const fileService = FileService.getInstance(fileRepository, storageService);

export const linkController = LinkController.getInstance(linkService);
export const fileController = FileController.getInstance(fileService);

export const middleware = Middlewares.getInstance(userRepository, linkRepository);

export const authService = AuthService.getInstance(notificationService, userRepository);
export const authController = AuthController.getInstance(authService);
export const cleanupService = CleanupService.getInstance(
    linkRepository,
    deletedFileRepository,
    cacheService
);



// Mount diesel to Auth route

export const dieselAuthService = DieselAuthService.getInstance(notificationService, userRepository)
export const dieselAuthController = DieselAuthController.getInstance(dieselAuthService)
export const dieselMiddleware = DieselMiddlewares.getInstance(userRepository, linkRepository, cacheService);
export const diesel_file_controller = DieselFileController.getInstance(fileService);
