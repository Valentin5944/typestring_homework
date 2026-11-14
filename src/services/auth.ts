import type { UserRepository } from "../domen/user/repositories.js";
import type { PublicUser } from "../domen/user/entity.js";
import type { AuthService, LoginResult } from "./service.types.js";
import type { LoginRequest, RegisterRequest } from "../transport/dto/requests.js";
import {hashPassword,verifyPassword,generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../lib/auth.js";

export interface appError {
    status: number;
    message: string;
}

export function appError(status: number, message: string): appError {
    return { status, message };
}

const trimEmail = (email: string): string => email.trim().toLowerCase();

export function createAuthService(userRepository: UserRepository): AuthService {
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

        return {
            user: { id: user.id, email: user.email },
            accessToken: generateAccessToken(user.id, user.email),
            refreshToken: generateRefreshToken(user.id, user.email)
        };
    };

    const refresh = async (refreshToken?: string): Promise<string> => {
        if (!refreshToken) {
            throw appError(401, "Refresh token not provided");
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            throw appError(401, "Refresh token invalid");
        }

        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            throw appError(401, "User not found");
        }

        return generateAccessToken(user.id, user.email);
    };

    return { register, login, refresh };
}