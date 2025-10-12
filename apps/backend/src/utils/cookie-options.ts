import { CookieOptions } from "hono/utils/cookie";

export const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "None",
    maxAge: 5 * 24 * 60 * 60,
};

export const refreshTokenOptions: CookieOptions = {
    ...accessTokenOptions,
    maxAge: 15 * 24 * 60 * 60,
};
