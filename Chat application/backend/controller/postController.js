import postModel from '../model/postModel.js';
import userModel from '../model/userModel.js';

export default class PostController {
    async addNewPost(req, res) {
        try {
            const { userId, description } = req.body;

            // Validate request data
            if (!userId || !description) {
                return res.status(400).json({ error: "User ID and description are required." });
            }

            // Check if user exists
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Add new post
            const newPost = await postModel.create({ userId, description });

            // Update user's post array
            user.post.push(newPost._id); // Save only the ID to avoid redundancy
            await user.save(); // Save the user document with the updated post array

            // Respond with success
            res.status(201).json({ message: "Post created successfully", post: newPost });
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ error: "An error occurred", details: error.message });
        }
    }
}
