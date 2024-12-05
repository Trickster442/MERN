import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true, // Ensure that a user is always associated with the comment
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Post', // Corrected reference to the 'Post' model
        required: true, // Ensure the comment is linked to a post
    },
    commentText: {
        type: String,
        required: true, // This was corrected from `trusted` to `true`
        trim: true, // Automatically removes extra spaces around the text
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// Create the Comment model
const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;
