import type { Post } from "../domen/post/entity.js";
import type { PublicUser } from "../domen/user/entity.js";
import type { CreatePostRequest, LoginRequest, RegisterRequest } from "../transport/dto/requests.js";

export interface PostService {
    getAll(category?: string, take?: string): Promise<Post[]>;
    getById(id: string): Promise<Post | undefined>;
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
    refresh(refreshToken?: string): Promise<string>;
}