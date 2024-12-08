import React, { useEffect, useState } from 'react';
import api from '../axios/configuration.js';
import '../styles/postFetch.css'
const PostFetch = () => {
    const [posts, setPosts] = useState([]); // Correct state name and initialization

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/post/allPost'); // Fetch posts from the API
                setPosts(response.data.posts); // Assuming the API response includes a "posts" field
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, posts); // Dependency array ensures the effect runs only once after component mounts

    return (
        <div className='post-container'>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div className='post-secondary-container'>
                    <div key={post._id}>
                        <h3>{post.description}</h3>
                    </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default PostFetch;
