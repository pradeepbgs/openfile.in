export const RATE_LIMIT = parseInt(process.env.UPLOAD_RATE_LIMIT) || 60
export const WINDOW = parseInt(process.env.UPLOAD_RATE_WINDOW) || 60

export const REFRESH_TOKEN_RATE_LIMIT = parseInt(process.env.REFRESH_TOKEN_RATE_LIMIT) || 10
export const REFRESH_TOKEN_RATE_WINDOW = parseInt(process.env.REFRESH_TOKEN_RATE_WINDOW) || 60