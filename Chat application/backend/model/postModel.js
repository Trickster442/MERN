import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
}, {
    timestamps: { // Corrected custom timestamp names
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const postModel = mongoose.model('Post', postSchema);

export default postModel;
