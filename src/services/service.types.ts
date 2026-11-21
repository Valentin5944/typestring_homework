import type { Post } from "../domain/post/entity.js";
import type { PublicUser } from "../domain/user/entity.js";
import type { CreatePostRequest, LoginRequest, RegisterRequest } from "../transport/dto/requests.js";

export interface PostService {
    getAll(category?: string, take?: string): Promise<Post[]>;
    getById(id: string): Promise<Post | null>;
    createPost(newPost: CreatePostRequest): Promise<Post>;
    getByAuthorId(authorId: number): Promise<Post[]>;
}
export interface LoginResult {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
}
export interface AuthService {
    register(data: RegisterRequest): Promise<PublicUser>;
    login(data: LoginRequest): Promise<LoginResult>;
    refresh(refreshToken?: string): Promise<RefreshResult>;
    logout(refreshToken?: string): Promise<void>;
}
export interface RefreshResult {
    accessToken: string;
    refreshToken: string;
}