import type { UserRepository } from "../domen/user/repositories.js";
import type { CreateUserData, User } from "../domen/user/entity.js";

export function createUserRepository(db: any): UserRepository {
    async function findByEmail(email: string): Promise<User | undefined> {
        const user = await db.orm.public.User.where({ email }).first();
        return user || undefined;
    }

    async function findById(id: number): Promise<User | undefined> {
        const user = await db.orm.public.User.where({ id }).first();
        return user || undefined;
    }

    async function create(data: CreateUserData): Promise<User> {
        return await db.orm.public.User.create({
            email: data.email,
            password: data.password
        });
    }

    return { findByEmail, findById, create };
}