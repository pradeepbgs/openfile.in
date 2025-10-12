import { prisma } from "../config/db";
import { IUserRepository } from "../interface/user.interface";

export default class UserRepository implements IUserRepository {
    private static instance: UserRepository

    constructor() { }

    static getInstance() {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance
    }

    async findUserId(id: number): Promise<{ id: number; } | null> {
        return await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true
            }
        })
    }

    async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async createUser(name: string, email: string, avatar: string) {
        return await prisma.user.create({
            data: {
                name,
                email,
                avatar,
                subscription: {
                    create: {}
                }
            }
        });
    }

    async findUserAndPlanName(userId: number) {
        return await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                linkCount: true,
                linkCountExpireAt: true,
                subscription: {
                    select: {
                        planName: true
                    }
                }
            }
        })
    }
}