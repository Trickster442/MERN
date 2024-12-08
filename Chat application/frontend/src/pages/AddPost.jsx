import React, { useState } from "react";
import axios from "../axios/configuration.js";
import "../styles/addPost.css";
import { jwtDecode } from "jwt-decode";

const AddPost = () => {
    const [post, setPost] = useState(""); // State to hold the post description

    const addPost = async (e) => {
        e.preventDefault();

        if (!post.trim()) {
            alert("Post content cannot be empty!");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // Get token from localStorage
            if (!token) {
                alert("No token found. Please log in.");
                return;
            }
            const decode = jwtDecode(token);
            const userId = decode.userId;
            
            // Make the API request
            const response = await axios.post(
                "/post/newPost",
                {
                  userId,
                  description: post }, // Only send the post content
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in headers
                    },
                }
            );

            // Handle response
            if (response.status === 201) {
                alert("Post added successfully!");
                setPost(""); // Clear the input field after a successful post
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error adding post:", error.response?.data || error.message || error);
            alert(error.response?.data?.error || "Failed to add post. Please try again.");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setPost(""); // Clear the input field
    };

    return (
        <div className="addPost-container">
            <form onSubmit={addPost}>
                <div className="addPost-secondary">
                <p>
                    UserName
                </p>
                <input
                    type="text"
                    name="postDescription"
                    className="post"
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                    placeholder="Write your post here..."
                    aria-label="Post description"
                />
                </div>
                <div className="button-container">
                    <button type="submit">Post</button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPost;
