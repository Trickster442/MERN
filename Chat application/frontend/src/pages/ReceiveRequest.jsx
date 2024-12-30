import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import
import api from '../axios/configuration.js';
import '../styles/receiveRequest.css'; // Retained external CSS import for additional customization

const ReceiveRequest = () => {
    const [receiveRequest, setReceiveRequest] = useState([]);

    useEffect(() => {
        const fetchReceiveRequest = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const userId = decoded.userId;
                    console.log(userId);
                    const response = await api.post('/request/allReceiveRequest', { userId });
                    const friendRequests = response.data.friendRequest;

                    if (friendRequests && friendRequests.length > 0) {
                        setReceiveRequest(friendRequests);
                    } else {
                        console.log("No requests available");
                    }
                } else {
                    console.log("Token not available");
                }
            } catch (e) {
                console.error("Error fetching receive requests:", e);
            }
        };

        fetchReceiveRequest(); // Call the function
    }, []); // Dependency array is empty to run only once on component mount

    return (
        <div className="receive-request-container">
            <h2>Connection Requests</h2>
            {/* Render the received requests */}
            {receiveRequest.length > 0 ? (
                <div className="request-list">
                    <ul>
                        {receiveRequest.map((request, index) => (
                            <li key={index} className="request-item">
                                <div className="request-info">
                                    <div className="request-avatar">
                                        {/* Placeholder for profile picture */}
                                        <span>{request.fullname[0]}</span>
                                    </div>
                                    <div>
                                        <p className="request-name">{request.fullname}</p>
                                        <button className="accept-btn">Accept</button>
                                        <button className="decline-btn">Decline</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No friend requests.</p>
            )}
        </div>
    );
};

export default ReceiveRequest;

