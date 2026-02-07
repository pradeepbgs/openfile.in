import { users } from "../db/schema";

export type User = typeof users.$inferSelect

export interface IUserRepository {

    findUserId(id: number): Promise<{ id: number } | null>;


    findUserByEmail(email: string): Promise<User | null>;

    createUser(name: string, email: string, avatar: string): Promise<User | null>;

    findUserAndPlanName(userId: number): Promise<{
        id: number;
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