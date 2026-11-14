import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser"
import { db } from "./prisma/db.js"; 
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post.js";
import { createPostHandler } from "./transport/handlers/post.js";
import { createPostRouter } from "./transport/routers/post.js";
import { createAuthRouter } from "./transport/routers/auth.js";
import { createUserRepository } from "./repositories/user.js";
import { createAuthService } from "./services/auth.js";
import { createAuthHandler } from "./transport/handlers/auth.js";


const app = express();
app.use(express.json());
app.use(cookieParser());

const userRepository = createUserRepository(db);
const postRepository = createPostRepository(db); 
const postService = createPostService(postRepository, userRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);
const authService = createAuthService(userRepository);
const authHandler = createAuthHandler(authService);
const authRouter = createAuthRouter(authHandler);

app.use("/posts", postRouter);
app.use("/auth", authRouter);

const PORT = 3000;
const HOST = "localhost";

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
