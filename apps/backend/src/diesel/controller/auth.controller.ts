import { type ContextType } from 'diesel-core'
import { IAuthService } from '../../interface/auth.interface';
import ApiResponse from '../../utils/apiRespone';
import { accessTokenOptions, refreshTokenOptions } from '../../utils/cookie-options';
import { handleErrorResponse } from '../../utils/handle-error';
import { authSchema } from '../../zod/schema';
import { HTTPException } from 'diesel-core/http-exception';

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

    handleGoogleSignIn = async (c: ContextType) => {
        console.log('from diesel to..')
        try {
            const body = await c.body
            const result = authSchema.safeParse(body)
            if (!result.success) {
                const message = result.error.errors[0].message
                throw new HTTPException(400, {
                     res: c.json({ error: message }, 400) 
                    })
                // return c.json({ error: message }, 400)
            }

            const { token } = result.data

            const apiRespone: ApiResponse = await this.authService.signInWithGoogle(token);

            c.setCookie("accessToken", apiRespone.data.accessToken, accessTokenOptions as any);
            c.setCookie("refreshToken", apiRespone.data.refreshToken, refreshTokenOptions as any);

            return c.json(apiRespone.data, apiRespone.statusCode);
        } catch (error) {
            console.error("Auth error:", error.message);
            throw new HTTPException(500, {
                res: handleErrorResponse(c, error)
            })
        
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
            throw new HTTPException(500, {
                res: handleErrorResponse(c, error)
            })
            return handleErrorResponse(c, error)
        }
    };

    checkAuth = async (c: ContextType) => {
        try {
            const user = c.get("user");
            return c.json({ user });
        } catch (error) {
            console.error("check auth error:", error.message);
            throw new HTTPException(500, {
                res: handleErrorResponse(c, error)
            })
            return handleErrorResponse(c, error)
        }
    };
}