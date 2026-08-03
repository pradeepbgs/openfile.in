import { IAuthService } from '../../../interface/auth.interface';
import ApiResponse from '../../../utils/apiRespone';
import { accessTokenOptions, refreshTokenOptions } from '../../../utils/cookie-options';
import { handleErrorResponse } from '../../../utils/handle-error';
import { loginSchema, registerSchema } from '../../../zod/schema';
import { HTTPException } from 'diesel-core/http-exception';
import { ContextType } from 'diesel-core';
import { mustGet } from '../../../utils/mustGet';
import { User } from '../../../interface/user.interface';

export class DieselAuthController {
    private static instance: DieselAuthController
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService
    }

    static getInstance(authService: IAuthService) {
        if (!DieselAuthController.instance) {
            DieselAuthController.instance = new DieselAuthController(authService)
        }
        return DieselAuthController.instance;
    }

    // OAuth (Google) sign-in disabled
    // handleGoogleSignIn = async (c: ContextType) => {
    //     try {
    //         const body = await c.body
    //         const result = authSchema.safeParse(body)
    //         if (!result.success) {
    //             const message = result.error.errors[0].message
    //             throw new HTTPException(400, { res: c.json({ error: message }, 400) })
    //         }
    //         const { token } = result.data
    //         const apiRespone: ApiResponse = await this.authService.signInWithGoogle(token);
    //         c.setCookie("accessToken", apiRespone.data.accessToken, accessTokenOptions as any);
    //         c.setCookie("refreshToken", apiRespone.data.refreshToken, refreshTokenOptions as any);
    //         return c.json(apiRespone.data, apiRespone.statusCode);
    //     } catch (error) {
    //         console.error("Auth error:", error.message);
    //         throw new HTTPException(500, { res: handleErrorResponse(c, error) })
    //         return handleErrorResponse(c, error)
    //     }
    // };
    // --- end OAuth ---

  signup = async (c: ContextType) => {
        return c.json({error:"SignUp is Disabled."}, 400)
        try {
            const body = await c.body
            const result = registerSchema.safeParse(body)
            if (!result.success) {
                const message = result.error!.errors[0].message
                throw new HTTPException(400, { res: c.json({ error: message }, 400) })
            }
            const { username, password } = result.data!
            const apiResponse: ApiResponse = await this.authService.signup(username, password);
            c.setCookie("accessToken", apiResponse.data.accessToken, accessTokenOptions as any);
            c.setCookie("refreshToken", apiResponse.data.refreshToken, refreshTokenOptions as any);
            return c.json(apiResponse.data, apiResponse.statusCode);
        } catch (error) {
            console.error("Signup error:", error.message);
            throw new HTTPException(500, { res: handleErrorResponse(c, error) })
            return handleErrorResponse(c, error)
        }
    };

  login = async (c: ContextType) => {
        try {
            const body = await c.body
            const result = loginSchema.safeParse(body)
            if (!result.success) {
                const message = result.error.errors[0].message
                throw new HTTPException(400, { res: c.json({ error: message }, 400) })
            }
            const { username, password } = result.data
            const apiResponse: ApiResponse = await this.authService.login(username, password);
            c.setCookie("accessToken", apiResponse.data.accessToken, accessTokenOptions as any);
            c.setCookie("refreshToken", apiResponse.data.refreshToken, refreshTokenOptions as any);
            return c.json(apiResponse.data, apiResponse.statusCode);
        } catch (error) {
            console.error("Login error:", error.message);
            throw new HTTPException(500, { res: handleErrorResponse(c, error) })
            return handleErrorResponse(c, error)
        }
    };

  logout = async (c: ContextType) => {
        try {
            c.setCookie("accessToken", "", accessTokenOptions as any);
            c.setCookie("refreshToken", "", refreshTokenOptions as any);
            return c.json({ message: "User logged out successfully" });
        } catch (error) {
            console.error("Logout error:", error.message);
            throw new HTTPException(500, { res: handleErrorResponse(c, error) })
            return handleErrorResponse(c, error)
        }
    };

  checkAuth = async (c: ContextType) => {
        try {
            const user = mustGet<User>(c, "user");
            return c.json({ user });
        } catch (error) {
            console.error("check auth error:", error.message);
            throw new HTTPException(500, { res: handleErrorResponse(c, error) })
            return handleErrorResponse(c, error)
        }
    };
}
