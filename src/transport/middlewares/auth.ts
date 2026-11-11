import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../lib/auth.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token missing" });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }

  req.user = decoded;
  next();
}
