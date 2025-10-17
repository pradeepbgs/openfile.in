import { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { AuthService } from "../service/auth.service";
import { authSchema } from "../zod/schema";
import ApiResponse from "../utils/apiRespone";
import { handleErrorResponse } from "../utils/handle-error";
import { accessTokenOptions, refreshTokenOptions } from "../utils/cookie-options";
import { IAuthService } from "../interface/auth.interface";

export class AuthController {
    private static instance: AuthController
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService
    }

    static getInstance(authService:IAuthService) {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController(authService)
        }
        return AuthController.instance;
    }

    handleGoogleSignIn = async (c: Context) => {
        try {
            const body = await c.req.json()

            const result = authSchema.safeParse(body)
            if (!result.success) {
                const message = result.error.errors[0].message
                return c.json({ error: message }, 400)
            }

            const { token } = result.data

            const apiRespone: ApiResponse = await this.authService.signInWithGoogle(token);

            setCookie(c, "accessToken", apiRespone.data.accessToken, accessTokenOptions);
            setCookie(c, "refreshToken", apiRespone.data.refreshToken, refreshTokenOptions);

            return c.json(apiRespone.data, apiRespone.statusCode);
        } catch (error) {
            console.error("Auth error:", error.message);
            return handleErrorResponse(c, error)
        }
    };

    logout = async (c: Context) => {
        try {
            deleteCookie(c, "accessToken");
            deleteCookie(c, "refreshToken");
            return c.json({ message: "User logged out successfully" });
        } catch (error) {
            console.error("Logout error:", error.message);
            return handleErrorResponse(c, error)
        }
    };

    checkAuth = async (c: Context) => {
        try {
            const user = c.get("user");
            return c.json({ user });
        } catch (error) {
            console.error("check auth error:", error.message);
            return handleErrorResponse(c, error)
        }
    };
}
