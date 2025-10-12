
export interface IUserRepository {

    findUserId(id: number): Promise<{ id: number } | null>;


    findUserByEmail(email: string): Promise<any | null>;

    createUser(name: string, email: string, avatar: string): Promise<any>;

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