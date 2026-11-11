export interface PostResponse {
    id: number;
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
    author: UserResponse;
    category: CategoryResponse;
}
export interface UserResponse {
    id: number;
    email: string;
}
export interface CategoryResponse {
    id: number;
    name: string;
}
