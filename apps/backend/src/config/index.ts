
export const CONFIG = {
    // SEVER
    PORT: process.env.PORT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

    // cloud flare storage related
    CLOUDFLARE_BUCKET: process.env.CLOUDFLARE_BUCKET,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY: process.env.CLOUDFLARE_ACCESS_KEY,
    CLOUDFLARE_SECRET_KEY: process.env.CLOUDFLARE_SECRET_KEY,
    CLOUDFLARE_TOKEN_VALUE: process.env.CLOUDFLARE_TOKEN_VALUE,
    STORAGE_TYPE: process.env.STORAGE_TYPE || 'r2',

    // database related
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_PASS: process.env.DB_PASS,
    DATABASE_URL: process.env.DATABASE_URL,

    // MAIL_ related
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,

    // REDIS
    REDIS_PASS: process.env.REDIS_PASS,
    REDIS_HOST: process.env.REDIS_HOST,

    // DODO_PAYMENTS
    DODO_PAYMENTS_API_KEY: process.env.DODO_PAYMENTS_API_KEY,
    DODO_PAYMENTS_WEBHOOK_KEY: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    DODO_PAYMENTS_ENVIRONMENT: process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'test_mode',
    DODO_PAYMENTS_RETURN_URL: process.env.DODO_PAYMENTS_RETURN_URL,

    //
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ?? '5d',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ?? '15d',

    RESNED_API_KEY:process.env.RESEND_API_KEY,

}