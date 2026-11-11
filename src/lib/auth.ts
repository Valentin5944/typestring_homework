import argon2 from "argon2";
import jwt from "jsonwebtoken";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} не задано в .env`);
  }
  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");
const PEPPER = requireEnv("PASSWORD_PEPPER");

export interface TokenPayload {
  userId: number;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password + PEPPER);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await argon2.verify(hash, password + PEPPER);
}

export function generateAccessToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as unknown as TokenPayload;
  } catch {
    return null;
  }
}