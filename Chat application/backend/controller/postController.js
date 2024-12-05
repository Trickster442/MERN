import postModel from '../model/postModel.js';
import userModel from '../model/userModel.js';
import commentModel from '../model/commentModel.js';

export default class PostController {
    // Method to add a new post
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
            user.post.push(newPost._id); // Save only the post ID
            await user.save(); // Save the user document with the updated post array

            // Respond with success
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost,
            });
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({
                success: false,
                error: "An error occurred while creating the post.",
                details: error.message,
            });
        }
    }

    // Method to add a new comment
    async addNewComment(req, res) {
        try {
            const { userId, postId, commentText } = req.body;

            // Validate request data
            if (!userId || !postId || !commentText) {
                return res.status(400).json({ error: "User ID, post ID, and comment text are required." });
            }

            // Check if user exists
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Check if post exists
            const post = await postModel.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found." });
            }

            // Create a new comment
            const newComment = await commentModel.create({ userId, postId, commentText });
            post.comment.push(newComment._id);
            await post.save(); // Save the user document with the updated post array
            // Respond with success
            res.status(201).json({
                success: true,
                message: "New comment added successfully.",
                comment: newComment,
            });
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({
                success: false,
                error: "An error occurred while adding the comment.",
                details: error.message,
            });
        }
    }
}
