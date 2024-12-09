import React, { useState, useEffect } from 'react';
import api from '../axios/configuration.js';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import '../styles/userList.css';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await api.get('/api/users');
                const lists = response.data.users;

                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const loggedInUser = decoded.userId; // Decode the token to get logged-in user ID
                    // Filter out the logged-in user
                    const newLists = lists.filter(user => user._id !== loggedInUser);
                    setUserList(newLists); // Update state with the filtered list
                } else {
                    setUserList(lists); // If no token, use the full list
                }
            } catch (error) {
                console.error("Error fetching user list:", error);
                setError("Failed to load user list. Please try again.");
            } finally {
                setLoading(false); // Ensure loading stops
            }
        };

        fetchUserList(); // Fetch users when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // Send a friend request to the selected user
    const sendRequest = async (toUserId) => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const fromUserId = decoded.userId;
            try {
                await api.post('/request/sendRequest', { fromUserId, toUserId });
                alert('Request sent successfully!');
            } catch (error) {
                console.error("Error sending request:", error);
                alert('Failed to send request. Please try again.');
            }
        }
    };

    return (
        <div className="user-list-container">
            <h3 className="header">Find People You May Know</h3>
            <ul className="user-list">
                {userList.map(user => (
                    <div className="friendRequest-box" key={user._id}>
                        <li className="user-item">{user.fullname}</li>
                        <button 
                            onClick={() => sendRequest(user._id)} // Correctly call the function
                        >
                            Send Request
                        </button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
