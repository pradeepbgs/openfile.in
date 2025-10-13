import { User } from "../generated/prisma";
import { users } from "../db/schema";

export interface IUserRepository {

    findUserId(id: number): Promise<{ id: number } | null>;


    findUserByEmail(email: string): Promise<User | typeof users | null>;

    createUser(name: string, email: string, avatar: string): Promise<User | typeof users | null>;

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