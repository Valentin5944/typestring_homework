import {postRepository} from "../repositories/post.js";

const getAll = (category, take) => {
    return postRepository.getAll(category, take);
}
const getById = (id) => {
    return postRepository.getById(id);
}
const createPost = (newPost) =>{
    return postRepository.addPost(newPost);
}
export const postService = { getAll, getById, createPost };