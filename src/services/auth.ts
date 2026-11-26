import type { UserRepository } from "../domain/user/repositories.js";
import type { PublicUser } from "../domain/user/entity.js";
import type { AuthService, LoginResult, RefreshResult} from "./service.types.js";
import type { LoginRequest, RegisterRequest } from "../transport/dto/requests.js";
import {hashPassword,verifyPassword,generateAccessToken,generateRefreshToken,verifyRefreshToken, hashRefreshToken,REFRESH_EXPIRE } from "../lib/auth.js";
import type { RefreshSessionRepository } from "../domain/refreshSession/repositories.js";

export interface appError {
    status: number;
    message: string;
}

export function appError(status: number, message: string): appError {
    return { status, message };
}

const trimEmail = (email: string): string => email.trim().toLowerCase();

export function createAuthService(
    userRepository: UserRepository,
    refreshSessionRepository: RefreshSessionRepository
): AuthService {
    const saveSession = async (userId: number, refreshToken: string): Promise<void> => {
        await refreshSessionRepository.create({
            userId,
            tokenHash: hashRefreshToken(refreshToken),
            expiresAt: new Date(Date.now() + REFRESH_EXPIRE* 1000),
        });
    };

    const register = async (data: RegisterRequest): Promise<PublicUser> => {
        const email = trimEmail(data.email);

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw appError(409, "User with this email already exists");
        }

        const password = await hashPassword(data.password);
        const created = await userRepository.create({ email, password });
        return { id: created.id, email: created.email };
    };

    const login = async (data: LoginRequest): Promise<LoginResult> => {
        const user = await userRepository.findByEmail(trimEmail(data.email));
        const passwordOk = user ? await verifyPassword(data.password, user.password) : false;

        if (!user || !passwordOk) {
            throw appError(401, "Invalid email or password");
        }

        const refreshToken = generateRefreshToken(user.id, user.email);
        await saveSession(user.id, refreshToken);

        return {
            user: { id: user.id, email: user.email },
            accessToken: generateAccessToken(user.id, user.email),
            refreshToken,
        };
    };

    const refresh = async (refreshToken?: string): Promise<RefreshResult> => {
        if (!refreshToken) {
            throw appError(401, "Refresh token not provided");
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
        throw appError(401, "Refresh token invalid");
        }

        const oldTokenHash = hashRefreshToken(refreshToken);
        const session = await refreshSessionRepository.findByHash(oldTokenHash);
        if (!session) {
            throw appError(401, "Refresh token already used or revoked");
        }

        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            throw appError(401, "User not found");
    }

        await refreshSessionRepository.deleteByHash(oldTokenHash);
        const newRefreshToken = generateRefreshToken(user.id, user.email);
        const newTokenHash = hashRefreshToken(newRefreshToken);
        await refreshSessionRepository.create({
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt: new Date(Date.now() + REFRESH_EXPIRE* 1000),
        });

        return {
            accessToken: generateAccessToken(user.id, user.email),
            refreshToken: newRefreshToken,
        };
    };

    const logout = async (refreshToken?: string): Promise<void> => {
        if (!refreshToken) {
            return;
        }
        await refreshSessionRepository.deleteByHash(hashRefreshToken(refreshToken));
    };

    return { register, login, refresh, logout };
}