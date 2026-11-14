import type { Request, Response } from "express";
import type { AuthService } from "../../services/service.types.js";
import type { AuthHandler } from "./handler.types.js";
import type { ErrorResponse } from "../dto/errors.js";
import { appError } from "../../services/auth.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import type { LoginRequest, RegisterRequest } from "../dto/requests.js";

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env["NODE_ENV"] === "production"
};

const NotEmpty = (value: any): value is string =>
    typeof value === "string" && value.trim().length > 0;

export function sendError(res: Response, error: any): Response {
    if (error && typeof error.status === "number") {
        const body: ErrorResponse = { error: error.message };
        return res.status(error.status).json(body);
    }
    throw error; 
}

export function createAuthHandler(authService: AuthService): AuthHandler {
    async function handleRegister(req: Request<{}, any, Partial<RegisterRequest>>, res: Response): Promise<void | Response> {
        const { email, password } = req.body ?? {};

        if (!NotEmpty(email) || !email.includes("@")) {
            return res.status(422).json({ error: "Invalid email" });
        }
        if (!NotEmpty(password) || password.length < 6) {
            return res.status(422).json({ error: "Password must be at least 6 characters long" });
        }

        try {
            const user = await authService.register({ email, password });
            return res.status(201).json(user);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async function handleLogin(req: Request<{}, any, Partial<LoginRequest>>, res: Response): Promise<void | Response> {
        const { email, password } = req.body ?? {};

        if (!NotEmpty(email) || !NotEmpty(password)) {
            return res.status(422).json({ error: "Email and password are required" });
        }

        try {
            const { user, accessToken, refreshToken } = await authService.login({ email, password });

            res.cookie("accessToken", accessToken, { ...cookieBase, maxAge: ACCESS_MAX_AGE });
            res.cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: REFRESH_MAX_AGE });

            return res.status(200).json({ message: "Logged in successfully", user });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async function handleRefresh(req: Request, res: Response): Promise<void | Response> {
        const refreshToken: string | undefined = req.cookies?.["refreshToken"];

        try {
            const accessToken = await authService.refresh(refreshToken);
            res.cookie("accessToken", accessToken, { ...cookieBase, maxAge: ACCESS_MAX_AGE });
            return res.status(200).json({ message: "refreshed" });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async function handleGetMe(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        return res.json({ id: req.user.userId, email: req.user.email });
    }

    return { handleRegister, handleLogin, handleRefresh, handleGetMe };
}