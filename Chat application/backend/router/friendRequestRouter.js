import express from 'express';
import FriendRequestController from '../controller/friendRequestController';


const friendRequestRouter = express.Router();
const friendRequestController = new FriendRequestController();

friendRequestRouter.post('/sendRequest', friendRequestController.sendFriendRequest)


export default friendRequestRouter;