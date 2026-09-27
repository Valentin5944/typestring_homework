import express from "express";
import postRouter from "./transport/routers/post.js";

const app = express();
app.use(express.json());

const HOST = 'localhost';
const PORT = 3000;

app.use("/posts", postRouter);

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
});