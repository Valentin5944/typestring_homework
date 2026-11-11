import type { Request, Response } from "express";
import type { CreatePostRequest, FilterPostQuery,LoginRequest, RegisterRequest } from "../dto/requests.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
type Result = Promise<void | Response>;
export interface PostHandler {
    handleGetAll(req: Request<{}, any, any, FilterPostQuery>, res: Response): Result;
    handleGetById(req: Request<{ id: string }>, res: Response): Result;
    handleCreate(req: Request<{}, any, Partial<CreatePostRequest>>, res: Response): Result;
    handleGetMyPosts(req: AuthenticatedRequest, res: Response): Result;
}

export interface AuthHandler {
    handleRegister(req: Request<{}, any, Partial<RegisterRequest>>, res: Response): Result;
    handleLogin(req: Request<{}, any, Partial<LoginRequest>>, res: Response): Result;
    handleRefresh(req: Request, res: Response): Result;
    handleGetMe(req: AuthenticatedRequest, res: Response): Result;
}
