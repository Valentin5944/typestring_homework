import type { CreateUserData, User } from "./entity.js";

export interface UserRepository {
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(data: CreateUserData): Promise<User>;
}