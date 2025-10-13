import { drizzle } from "drizzle-orm/neon-http";
import { IUserRepository } from "../interface/user.interface";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export type DrizzleClient = ReturnType<typeof drizzle>;

export default class UserRepositoryDrizzle implements IUserRepository {

    private static instance: UserRepositoryDrizzle;
    private client: DrizzleClient;

    private constructor(client: DrizzleClient) {
        this.client = client;
    }

    static getInstance(client: DrizzleClient) {
        if (!UserRepositoryDrizzle.instance) {
            UserRepositoryDrizzle.instance = new UserRepositoryDrizzle(client);
        }
        return UserRepositoryDrizzle.instance;
    }

    createUser(name: string, email: string, avatar: string): Promise<any> {

    }
    findUserAndPlanName(userId: number): Promise<{ id: number; name: string; email: string; avatar: string; linkCount: number; linkCountExpireAt: Date | null; subscription: { planName: string; } | null; } | null> {

    }
    findUserByEmail(email: string): Promise<any | null> {

    }

    async findUserId(id: number) {
        return await this.client.select().from(users).where(eq(users.id, id)).;
    }
}