import express from 'express';
import PostController from '../controller/postController.js';

const postRouter = express.Router();
const postController = new PostController();

postRouter.post('/newPost', postController.addNewPost);


export default postRouter;