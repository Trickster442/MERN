import React, { useState, useEffect } from 'react';
import api from '../axios/configuration.js';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import '../styles/userList.css';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [sentRequestList, setSentRequestList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //all userlist except loggedin user list
        const fetchUserList = async () => {
            try {
                const response = await api.get('/api/users');
                const users = response.data.users;

                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const loggedInUserId = decoded.userId; // Decode the token to get logged-in user ID
                    // Filter out the logged-in user
                    const filteredUsers = users.filter(user => user._id !== loggedInUserId);
                    setUserList(filteredUsers); // Update state with the filtered list
                } else {
                    setUserList(users); // If no token, use the full list
                }
            } catch (err) {
                console.error("Error fetching user list:", err);
                setError("Failed to load user list. Please try again.");
            } finally {
                setLoading(false); // Ensure loading stops
            }
        };

        // all request list sent by logged in user
        const fetchSentRequestList = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                try {
                    const response = await api.post('/request/allSentRequest', { userId });
                    setSentRequestList(response.data.sentRequests); // Save the sent request list
                } catch (err) {
                    console.error("Error fetching sent requests:", err);
                }
            }
        };

        // Fetch users and sent requests when the component mounts
        fetchUserList();
        fetchSentRequestList();
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
                // Add to sentRequestList locally to update UI without re-fetching
                setSentRequestList(prev => [...prev, { _id: toUserId }]);
            } catch (err) {
                console.error("Error sending request:", err);
                alert('Failed to send request. Please try again.');
            }
        }
    };

    // Cancel a friend request
    const cancelRequest = async (toUserId) => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const fromUserId = decoded.userId;
            try {
                await api.post('/request/cancelRequest', { fromUserId, toUserId });
                alert('Request canceled successfully!');
                // Remove from sentRequestList locally to update UI without re-fetching
                setSentRequestList(prev => prev.filter(request => request._id !== toUserId));
            } catch (err) {
                console.error("Error canceling request:", err);
                alert('Failed to cancel request. Please try again.');
            }
        }
    };

    return (
        <div className="user-list-container">
            <h3 className="header">Find People You May Know</h3>
            <ul className="user-list">
                {userList.map(user => {
                    const isRequestSent = sentRequestList.some(request => request._id === user._id);
                    return (
                        <div className="friendRequest-box" key={user._id}>
                            <li className="user-item">{user.fullname}</li>
                            {isRequestSent ? (
                                <button 
                                    onClick={() => cancelRequest(user._id)}
                                    className="cancel-button"
                                >
                                    Cancel Request
                                </button>
                            ) : (
                                <button 
                                    onClick={() => sendRequest(user._id)}
                                    className="send-button"
                                >
                                    Send Request
                                </button>
                            )}
                        </div>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserList;
