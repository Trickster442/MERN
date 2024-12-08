import userModel from "../model/userModel";

export default class FriendRequestController{

    //sending friend request
    async sendFriendRequest(req, res) {
        const { fromUserId, toUserId } = req.body;
    
        try {
            // Fetch the user sending the friend request
            const fromUser = await userModel.findById(fromUserId);
            if (!fromUser) {
                return res.status(404).json({ message: "Sender not found" });
            }
    
            // Check if the recipient is already a friend
            const isFriend = fromUser.friends.includes(toUserId);
            if (isFriend) {
                return res.status(400).json({ message: "This user is already your friend" });
            }
    
            // Fetch the recipient of the friend request
            const toUser = await userModel.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({ message: "Recipient not found" });
            }
    
            // Check if the friend request is already sent
            if (toUser.friendRequest.includes(fromUserId)) {
                return res.status(400).json({ message: "Friend request already sent" });
            }
    
            // Add the request to the array
            toUser.friendRequest.push(fromUserId);
            fromUser.sentRequest.push(toUserId);
            await toUser.save();
            await fromUser.save();

            return res.status(200).json({ message: "Friend request sent successfully" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    
    //cancelling the requested friend request
    async cancelFriendRequest(req, res) {
        const { fromUserId, toUserId } = req.body;
    
        try {
            // Fetch the user who sent the friend request
            const fromUser = await userModel.findById(fromUserId);
            if (!fromUser) {
                return res.status(404).json({ message: "Sender not found" });
            }
    
            // Fetch the user who received the friend request
            const toUser = await userModel.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({ message: "Recipient not found" });
            }
    
            // Check if the friend request exists
            const isSent = fromUser.sentRequest.includes(toUserId);
            if (!isSent) {
                return res.status(400).json({ message: "No friend request found to cancel" });
            }
    
            // Remove the request from both users
            fromUser.sentRequest.pull(toUserId);
            toUser.friendRequest.pull(fromUserId);
    
            // Save changes to both documents
            await fromUser.save();
            await toUser.save();
    
            return res.status(200).json({ message: "Friend request canceled successfully" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    

    // accepting the request
    async acceptFriendRequest(req,res){

    }

    // deleting the request
    async deleteFriendRequest(req,res){

    }


}