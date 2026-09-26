import {postService} from "../services/post.js";

function handleGetAll(req, res) {

    const category = req.query.category;
    const take = req.query.take;


    const postsList = postService.getAll(category, take);

    res.json(postsList);
}

function handleGetById(req, res) {

    const postId = req.params.id;


    const foundPost = postService.getById(postId);

    if (!foundPost) {

        return res.status(404).json({ error: "Пост не найден" });
    }

    res.json(foundPost);
}


async function handleCreate(req, res) {

    const newPostData = req.body;

    if (!newPostData.title || !newPostData.content) {

        return res.status(422).json({ error: "Нет title или content" });
    }
    const createdPost = await postService.createPost(newPostData);
    res.status(201).json(createdPost);
}


export const postHandler = { handleGetAll, handleGetById, handleCreate};
