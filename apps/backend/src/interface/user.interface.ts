import { users } from "../db/schema";

export interface IUserRepository {

    findUserId(id: string): Promise<{ id: number } | null>;


    findUserByEmail(email: string): Promise< typeof users | null>;

    createUser(id: string, name: string, email: string, avatar: string): Promise< typeof users | null>;

    findUserAndPlanName(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        linkCount: number;
        linkCountExpireAt: Date | null;
        subscription: {
            planName: string;
        } | null;
    } | null>;
}