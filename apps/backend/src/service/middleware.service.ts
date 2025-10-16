import { linkRepository, userRepository } from "../../server.conf";
import { ApiError } from "../utils/apiError";
import { verifyToken } from "../utils/jwt";

export class MiddlewareService {

    // The constructor can be removed if it's empty and the class only contains static methods.
    // constructor() {}

    static async verifyAuthToken(token?: string) {
        if (!token) throw new ApiError("No token provided", 401);

        if (token.startsWith("Bearer ")) token = token.slice(7);

        const decoded = verifyToken(token);
        if (!decoded?.id) throw new ApiError("Invalid token", 401);

        const user = await userRepository.findUserAndPlanName(decoded.id as number);
        if (!user) throw new ApiError("User not found", 401);

        return user;
    }

    static async fetchUser(token?: string) {
        if (!token) throw new ApiError("No token provided", 401);

        if (token.startsWith("Bearer ")) token = token.slice(7);

        const decoded = verifyToken(token);
        if (!decoded?.id) throw new ApiError("Invalid token", 401);

        const user = await userRepository.findUserId(decoded.id as number);
        if (!user) throw new ApiError("User not found", 401);

        return user;
    }

    static async fetchUserLinks(token: string, query: string, page: number, limit: number) {
        if (token.startsWith("Bearer ")) token = token.slice(7);

        const decoded = verifyToken(token);
        if (!decoded?.id) throw new ApiError("Invalid token", 401);

        const skip = (page - 1) * limit;
        const links = await linkRepository.findUserLinks(decoded.id as number, query, skip, limit);

        return { userId: decoded.id, links };
    }

    static async fetchLinkWithUser(token: string, linkId: number) {
        if (token.startsWith("Bearer ")) token = token.slice(7);

        const decoded = verifyToken(token);
        if (!decoded?.id) throw new ApiError("Invalid token", 401);

        const link = await linkRepository.findLinkByIdAndUser(linkId, decoded.id as number);
        if (!link) throw new ApiError("Link not found or user unauthorized", 404);

        return { userId: decoded.id, link };
    }

    static async fetchFilesByToken(token: string, linkId: number, linkToken: string, page: number, limit: number) {
        if (token.startsWith("Bearer ")) token = token.slice(7);

        const decoded = verifyToken(token);
        if (!decoded?.id) throw new ApiError("Invalid token", 401);

        const skip = (page - 1) * limit;
        const link = await linkRepository.findLinkWithFilesByTokenAndUserId(linkId, linkToken, decoded.id as number, skip, limit);
        if (!link) throw new ApiError("No files found or unauthorized access", 404);

        return link;
    }
}
