import express from 'express';
import PostController from '../controller/postController.js';
import authorizationForPost from '../middleware/authorizationForPost.js'
const postRouter = express.Router();
const postController = new PostController();

postRouter.post('/newPost', postController.addNewPost);
postRouter.get('/allPost', postController.getAllPost);


//routes to handle comment in post
postRouter.post('/addComment',authorizationForPost, postController.addNewComment);

export default postRouter;