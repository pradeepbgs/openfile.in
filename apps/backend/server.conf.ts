import { DieselAuthController } from "./src/api/diesel/controller/auth.controller";
import DieselFileController from "./src/api/diesel/controller/file.controller";
import { DieselMiddlewares } from "./src/api/diesel/middleware";
import { AuthController } from "./src/api/hono/controllers/auth.controller";
import FileController from "./src/api/hono/controllers/file.controllers";
import LinkController from "./src/api/hono/controllers/link.controller";
import { Middlewares } from "./src/api/hono/middleware/middleware";
import { CONFIG } from "./src/config";
import { createDBClient } from "./src/config/db";
import { IDeleteFileRepo } from "./src/interface/delete-file.interface";
import { IFileRepo } from "./src/interface/file.interface";
import { ILinkRepo } from "./src/interface/link.interface";
import { ISubscriptionRepo } from "./src/interface/subsc.interface";
import { IUserRepository } from "./src/interface/user.interface";
import { DeletedFileRepositoryDrizzle } from "./src/repository/deleted.file.drizzle";
import { FileRepositoryDrizzle } from "./src/repository/file.drizzle";
import { LinkRepositoryDrizzle } from "./src/repository/link.drizzle";
import { SubscriptionRepositoryDrizzle } from "./src/repository/subscription.drizzle";
import UserRepositoryDrizzle, { DrizzleClient } from "./src/repository/user.drizzle";
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

export function createRepository(repositoryName: RepositoryName, dbType?: string)
    : ILinkRepo | IUserRepository | IFileRepo | IDeleteFileRepo | ISubscriptionRepo {
    const clientType = dbType || CONFIG.DB_CLIENT;
    const client = createDBClient(clientType as any)

    switch (repositoryName) {
        case 'link':
            if (clientType === 'drizzle') return LinkRepositoryDrizzle.getInstance(client as DrizzleClient)
            // return LinkRepository.getInstance(client as PrismaClient);
        case 'deleted_file':
            if (clientType === 'drizzle') return DeletedFileRepositoryDrizzle.getInstance(client as DrizzleClient)
            // return DeletedFileRepository.getInstance(client as PrismaClient);
        case 'user':
            if (clientType === 'drizzle') return UserRepositoryDrizzle.getInstance(client as DrizzleClient)
            // return UserRepository.getInstance(client as PrismaClient);
        case 'file':
            if (clientType === 'drizzle') return FileRepositoryDrizzle.getInstance(client as DrizzleClient)
            // return FileRepository.getInstance(client as PrismaClient);
        case 'subscription':
            if (clientType === 'drizzle') return SubscriptionRepositoryDrizzle.getInstance(client as DrizzleClient) as ISubscriptionRepo
            // return SubscriptionRepository.getInstance(client as PrismaClient) as ISubscriptionRepo;

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

// Repositories DB
// now we have fully migrated to drizzle.
export const linkRepository = createRepository('link') as ILinkRepo
export const userRepository = createRepository('user') as IUserRepository
export const subscriptionRepository = createRepository('subscription') as ISubscriptionRepo
export const fileRepository = createRepository('file') as IFileRepo
export const deletedFileRepository = createRepository('deleted_file') as IDeleteFileRepo


export const linkService = LinkService.getInstance(
    linkRepository,
    deletedFileRepository,
);

export const fileService = FileService.getInstance(fileRepository, storageService);

export const linkController = LinkController.getInstance(linkService);
export const fileController = FileController.getInstance(fileService as any); // will solve ts err

export const middleware = Middlewares.getInstance(userRepository, linkRepository);

export const authService = AuthService.getInstance(notificationService, userRepository);
export const authController = AuthController.getInstance(authService);
export const cleanupService = CleanupService.getInstance(
    linkRepository,
    deletedFileRepository,
    cacheService
);



// for diesel.js

export const dieselAuthController = DieselAuthController.getInstance(authService)
export const dieselMiddleware = DieselMiddlewares.getInstance(userRepository, linkRepository, cacheService);
export const diesel_file_controller = DieselFileController.getInstance(fileService as any); // will solve ts err
