import userModel from "../model/userModel.js";

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
    
    //to get all the recieve request
    async getAllRecieveRequest(req, res) {
        const { userId } = req.body;
    
        try {
            // Find the user by ID and populate the 'friendRequest' field with 'fullname'
            const user = await userModel.findById(userId).populate('friendRequest', 'fullname -_id');
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Return the populated friend requests
            return res.status(200).json({
                message: "Friend requests fetched successfully",
                friendRequest: user.friendRequest,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    
    
    //to check all request sent by particular user
    async getAllSentRequest(req, res) {
    const { userId } = req.body;

    try {
        // Find the user and populate the 'sentRequest' field with 'fullname'
        const user = await userModel
            .findById(userId)
            .populate('sentRequest', 'fullname'); // Populates only the fullname field of sentRequest

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract the populated sent requests
        const sentRequests = user.sentRequest.map(request => ({
            _id: request._id,
            fullname: request.fullname,
        }));

        // Return the populated sent requests
        return res.status(200).json({
            message: "Sent requests fetched successfully",
            sentRequests, // Return the list of sent requests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error });
    }
}


    async getSentRequest(req, res) {
        const { userId } = req.body;
    
        try {
            // Find the user and populate the 'sentRequest' field with 'fullname'
            const user = await userModel
                .findById(userId)
                .populate('sentRequest', 'fullname');
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Return the populated sent requests
            return res.status(200).json({
                message: "Sent requests fetched successfully",
                sentRequest: user.fullname,
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    
    // accepting the request
    async acceptFriendRequest(req, res) {
        try {
            const { toUserId, fromUserId } = req.body;
    
            // Find the user who received the request
            const toUser = await userModel.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({ message: "Receiver user not found" });
            }
    
            // Check if the request exists in the receiver's friendRequest list
            const friendRequestIndex = toUser.friendRequest.indexOf(fromUserId);
            if (friendRequestIndex === -1) {
                return res.status(400).json({ message: "No friend request from this user" });
            }
    
            // Find the user who sent the request
            const fromUser = await userModel.findById(fromUserId);
            if (!fromUser) {
                return res.status(404).json({ message: "Sender user not found" });
            }
    
            // Remove from friendRequest list of the receiver
            toUser.friendRequest.splice(friendRequestIndex, 1);
    
            // Remove from sentRequest list of the sender
            const sentRequestIndex = fromUser.sentRequest.indexOf(toUserId);
            if (sentRequestIndex !== -1) {
                fromUser.sentRequest.splice(sentRequestIndex, 1);
            }
    
            // Add each other as friends
            toUser.friends.push(fromUserId);
            fromUser.friends.push(toUserId);
    
            // Save the updated users
            await toUser.save();
            await fromUser.save();
    
            return res.status(200).json({ message: "Friend request accepted successfully" });
        } catch (error) {
            console.error("Error accepting friend request:", error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    

    // deleting the request
    async deleteFriendRequest(req,res){

    }


}