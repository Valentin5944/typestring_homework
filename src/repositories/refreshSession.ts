import type { RefreshSessionRepository } from "../domain/refreshSession/repositories.js";

type Database = typeof import("../prisma/db.js").db;

export function createRefreshSessionRepository(db: Database): RefreshSessionRepository {
    return {
        async create(data) {
            return await db.orm.public.RefreshSession.create({
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
            });
        },

        async findByHash(tokenHash) {
            return await db.orm.public.RefreshSession.where({ tokenHash }).first();
        },

        async deleteByHash(tokenHash) {
            await db.orm.public.RefreshSession.where({ tokenHash }).delete();
        },
    };
}