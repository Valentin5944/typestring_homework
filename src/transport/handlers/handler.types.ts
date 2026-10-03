import type { Request, Response } from "express";
import type { CreatePostRequest } from "../dto/requests.js";

export interface PostHandler {
    handleGetAll(req: Request<any, any, any, { category?: string; take?: string }>, res: Response): void;
    handleGetById(req: Request<{ id: string }>, res: Response): void | Response;
    handleCreate(req: Request<any, any, CreatePostRequest>, res: Response): Promise<void | Response>;
}
