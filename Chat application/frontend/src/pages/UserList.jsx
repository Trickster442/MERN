import React, { useState, useEffect } from 'react';
import api from '../axios/configuration.js';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import '../styles/userList.css';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [sentRequestList, setSentRequestList] = useState([]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("User is not authenticated");

                const decoded = jwtDecode(token);
                const loggedInUserId = decoded.userId;

                // Fetch friend list
                const friendResponse = await api.post('/request/friends', { userId: loggedInUserId });
                const friendList = friendResponse.data.list || [];
                setFriends(friendList);

                // Fetch all users except logged-in user and friends
                const userResponse = await api.get('/api/users');
                const allUsers = userResponse.data.users || [];
                const friendSet = new Set(friendList.map(friend => friend)); // Optimize lookup with Set
                const filteredUsers = allUsers.filter(user => user._id !== loggedInUserId && !friendSet.has(user._id));
                setUserList(filteredUsers);

                // Fetch sent friend requests
                const sentRequestResponse = await api.post('/request/allSentRequest', { userId: loggedInUserId });
                const sentRequests = sentRequestResponse.data.sentRequests || [];
                setSentRequestList(sentRequests);

                setError(null); // Reset error on success
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false); // Stop loading after fetch
            }
        };

        fetchAllData();
    }, []); // Empty dependency array ensures this runs only once

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const sendRequest = async (toUserId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("User is not authenticated");

            const decoded = jwtDecode(token);
            const fromUserId = decoded.userId;

            await api.post('/request/sendRequest', { fromUserId, toUserId });
            alert('Request sent successfully!');
            setSentRequestList(prev => [...prev, { _id: toUserId }]); // Update UI optimistically
        } catch (err) {
            console.error("Error sending request:", err);
            alert('Failed to send request. Please try again.');
        }
    };

    const cancelRequest = async (toUserId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("User is not authenticated");

            const decoded = jwtDecode(token);
            const fromUserId = decoded.userId;

            await api.post('/request/cancelRequest', { fromUserId, toUserId });
            alert('Request canceled successfully!');
            setSentRequestList(prev => prev.filter(request => request._id !== toUserId)); // Update UI optimistically
        } catch (err) {
            console.error("Error canceling request:", err);
            alert('Failed to cancel request. Please try again.');
        }
    };

    return (
        <div className="user-list-container">
            <h3 className="header">Find People You May Know</h3>
            <ul className="user-list">
                {userList.map(user => {
                    const isRequestSent = sentRequestList.some(request => request._id === user._id);
                    const isFriend = friends.some(friend => friend === user._id);

                    return (
                        <div className="friendRequest-box" key={user._id}>
                            <li className="user-item">{user.fullname}</li>
                            {!isFriend && (
                                isRequestSent ? (
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
                                )
                            )}
                        </div>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserList;
