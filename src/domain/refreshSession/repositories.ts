import type { CreateRefreshSessionData, RefreshSession } from "./entity.js";

export interface RefreshSessionRepository {
    create(data: CreateRefreshSessionData): Promise<RefreshSession>;
    findByHash(tokenHash: string): Promise<RefreshSession | null>;
    deleteByHash(tokenHash: string): Promise<void>;
}