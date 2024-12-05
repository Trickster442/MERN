import express from 'express';
import PostController from '../controller/postController.js';

const postRouter = express.Router();
const postController = new PostController();

postRouter.post('/newPost', postController.addNewPost);



//routes to handle comment in post
postRouter.post('/addComment', postController.addNewComment);

export default postRouter;