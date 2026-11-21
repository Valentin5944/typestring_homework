import type { UserRepository } from "../domain/user/repositories.js";
import type { CreateUserData, User } from "../domain/user/entity.js";

type Database = typeof import("../prisma/db.js").db;

export function createUserRepository(db: Database): UserRepository {
    return {
        async findByEmail(email) {
            return await db.orm.public.User.where({ email }).first();
        },

        async findById(id) {
            return await db.orm.public.User.where({ id }).first();
        },

        async create(data) {
            return await db.orm.public.User.create({
                email: data.email,
                password: data.password,
            });
        },
    };
}