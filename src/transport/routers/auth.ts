import { Router } from "express";
import type { AuthHandler } from "../handlers/handler.types.js";
import { requireAuth } from "../middlewares/auth.js";

export function createAuthRouter(authHandler: AuthHandler): Router {
    const router = Router();

    router.post("/register", authHandler.handleRegister);
    router.post("/login", authHandler.handleLogin);
    router.post("/refresh", authHandler.handleRefresh);
    router.get("/me", requireAuth, authHandler.handleGetMe);

    return router;
}