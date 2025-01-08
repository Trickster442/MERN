import express from 'express';
import FriendRequestController from '../controller/friendRequestController.js';


const friendRequestRouter = express.Router();
const friendRequestController = new FriendRequestController();

friendRequestRouter.post('/sendRequest', friendRequestController.sendFriendRequest);
friendRequestRouter.post('/allSentRequest', friendRequestController.getAllSentRequest);
friendRequestRouter.post('/getSentRequest', friendRequestController.getSentRequest);
friendRequestRouter.post('/cancelRequest', friendRequestController.cancelFriendRequest);
friendRequestRouter.post('/allReceiveRequest', friendRequestController.getAllRecieveRequest);
friendRequestRouter.post('/acceptFriendRequest', friendRequestController.acceptFriendRequest);
friendRequestRouter.post('/deleteFriendRequest', friendRequestController.deleteFriendRequest);
friendRequestRouter.post('/friends', friendRequestController.friendList);

export default friendRequestRouter;