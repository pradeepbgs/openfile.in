import { describe, it, expect, beforeAll } from "bun:test";
import { FileRepositoryDrizzle } from "./file.drizzle";
import { DrizzleClient } from "./user.drizzle";
import { createDBClient } from "../config/db.js";


describe("FileRepositoryDrizzle", () => {
    const mockClient = createDBClient('drizzle') as DrizzleClient
    let repo: FileRepositoryDrizzle;
    let userId = 1;
    let linkId = 257;
    const token = process.env.TEST_LINK_TOKEN 
    console.log('token ', token)

    beforeAll(() => {
        repo = FileRepositoryDrizzle.getInstance(mockClient);
    });

    it("should create a file and update link", async () => {
        const [file, link] = await repo.createFileAndUpdateLink(
            { url: "https://example.com/file.png", name: "file.png", size: 1024 },
            linkId,
            userId
        ) || [];

        expect(file).not.toBeNull();
        expect(file?.name).toBe("file.png");
        expect(link).not.toBeNull();
    });

    it("should find file by fileId, userId, and linkId", async () => {
        const created = await repo.createFileAndUpdateLink(
            { url: "https://example.com/file2.png", name: "file2.png", size: 2048 },
            linkId,
            userId
        );

        const file = await repo.findFileByIdUserIdAndLinkId(created![0].id, userId, linkId);
        expect(file).not.toBeNull();
        expect(file?.id).toBe(created![0].id);
    });

    it("should find link by token and userId", async () => {
        const link = await repo.findLinkByTokenAndUserId(token, userId);
        expect(link).toBeDefined();
    });

    it("should get files with pagination", async () => {
        const files = await repo.getFiles(linkId, userId, 0, 10);
        expect(Array.isArray(files)).toBe(true);
    });

    it("should calculate storage used by user", async () => {
        const storage = await repo.storageUsed(userId);
        expect(storage).toBeDefined();
        expect(storage[0].totalSize).toBeDefined();
    });

    it("should get user by id", async () => {
        const user = await repo.getUser(userId);
        expect(user).not.toBeNull();
        expect(user?.id).toBe(userId);
    });
});
