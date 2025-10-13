import { drizzle } from "drizzle-orm/neon-http";
import { IUserRepository } from "../interface/user.interface";
import { subscriptions, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createDBClient } from "../config/db";
import { User } from "../generated/prisma";
import UserRepository from "./user.repo";

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

    async createUser(name: string, email: string, avatar: string): Promise<User | typeof users | null> {
        const now = new Date();     
        try {
            const [newUser] = await this.client
                .insert(users)
                .values({
                    name,
                    email,
                    avatar,
                    createdAt:now,
                    updatedAt:now
                })
                .returning();
            if (!newUser) {
                console.error("Failed to insert new User.");
                return null
            }

            const [newSubscription] = await this.client
                .insert(subscriptions)
                .values({
                    userId: newUser.id,
                    planName: 'free',
                    createdAt:now,
                    updatedAt:now
                })
                .returning()
            if (!newSubscription) {
                console.error("Failed to insert new subscription.");
                return null
            }
            return newUser
        } catch (error) {
            console.error("Database error during createUser:", error);
            return null;
        }
    }

    async findUserAndPlanName(userId: number): Promise<{ id: number; name: string; email: string; avatar: string; linkCount: number; linkCountExpireAt: Date | null; subscription: { planName: string; } | null; } | null> {
        const data = await this.client
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                avatar: users.avatar,
                linkCount: users.linkCount,
                linkCountExpireAt: users.linkCountExpireAt,
                subscription: {
                    planName: subscriptions.planName
                }

            })
            .from(users)
            .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
            .where(eq(users.id, userId))
            .limit(1)

        return data[0] ?? null
    }

    findUserByEmail = async (email: string): Promise<User | typeof users | null> => {
        const data = await this.client
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        return data[0] ?? null;
    }

    async findUserId(id: number) {
        const data = await this.client
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return data[0] ?? null;
    }
}

const dc = createDBClient('drizzle') as any
const drizzleUser = UserRepositoryDrizzle.getInstance(dc)
const prismaU = UserRepository.getInstance(createDBClient('prisma') as any)
// const user = await s.findUserId(1)
// console.log(user)

// const userbyemail = await drizzleUser.findUserByEmail('pradeepkumarbgs62019@gmail.com')
// console.log(userbyemail)

// const userbyprisma = await prismaU.findUserByEmail('pradeepkumarbgs62019@gmail.com')
// console.log(userbyprisma)

// const userwithplanname = await drizzleUser.findUserAndPlanName(1)
// console.log(userwithplanname)

// const userwithplannameprisma = await prismaU.findUserAndPlanName(1)
// console.log(userwithplannameprisma)


// const createdUserDr = await drizzleUser.createUser('test5', 'test5@gmail.com', '')
// console.log(createdUserDr)

// const createdUserPrisma = await prismaU.createUser('test5', 'test6@gmail.com', '')
// console.log(createdUserPrisma)