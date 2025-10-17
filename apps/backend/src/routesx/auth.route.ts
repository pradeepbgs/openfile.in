import { Hono } from "hono";
import { authController, middleware } from "../../server.conf";


export const authRouter = new Hono()


authRouter
    .post("/google", authController.handleGoogleSignIn)
    .get('/check', middleware.authJwt, authController.checkAuth)
    .get('/logout', authController.logout)