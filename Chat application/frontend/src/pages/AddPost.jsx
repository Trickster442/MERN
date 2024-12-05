import React, { useState } from "react";
import axios from "../axios/configuration.js";
import "../styles/addPost.css";

const AddPost = () => {
  const [post, setPost] = useState(""); // State to hold the post description
  const userId = "674dcd47c375336f042078f7"; // Assuming userId is constant here; consider passing it as a prop or context if dynamic

  const addPost = async (e) => {
    e.preventDefault();

    if (post.trim().length === 0) {
      alert("Post content cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (token) {
        const response = await axios.post("/post/newPost", {
          userId,
          description: post, // Send the post description in the request body
        }, {
          headers: {
            token,          
          }
        });

        if (response.status === 200 || response.status === 201) {
          alert("Post added successfully!");
          setPost(""); // Clear the input field after a successful post
        } else {
          console.error("Unexpected response:", response);
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        alert("No token found. Please log in.");
      }
    } catch (error) {
      console.error("Error adding post:", error.message || error);
      alert("Failed to add post. Please try again.");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setPost(""); // Clear the input field
  };

  return (
    <div className="addPost-container">
      <form onSubmit={addPost}>
        <input
          type="text"
          name="postDescription"
          className="post"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write your post here..."
          aria-label="Post description"
        />
        <div className="button-container">
          <button type="submit">Post</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
