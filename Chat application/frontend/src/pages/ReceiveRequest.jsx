import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import
import api from '../axios/configuration.js';
import '../styles/receiveRequest.css'; // Retained external CSS import for additional customization
import Header from './Header.jsx';
const ReceiveRequest = () => {
    const [receiveRequest, setReceiveRequest] = useState([]);

    useEffect(() => {
        const fetchReceiveRequest = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const userId = decoded.userId;
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

    const acceptRequest = async(reqId)=>{
        try{
            const token = localStorage.getItem('token');
            if(token){
                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                await api.post('/request/acceptFriendRequest', {toUserId:userId,fromUserId:reqId})

                setReceiveRequest((prevRequests) =>
                    prevRequests.filter((request) => request._id !== reqId)
                );
            } 
        }catch(err){
            console.log(err);
        }
    }

    const deleteRequest = async(reqId)=>{
        try{
            const token = localStorage.getItem('token');
            if(token){
                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                await api.post('/request/deleteFriendRequest', {toUserId:userId,fromUserId:reqId})

                setReceiveRequest((prevRequests) =>
                    prevRequests.filter((request) => request._id !== reqId)
                );
            } 
        }catch(err){
            console.log(err);
        }
    }
    return (
        <>
        <Header/>
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
                                        <button className="accept-btn" onClick={()=>acceptRequest(request._id)}>Accept</button>
                                        <button className="decline-btn" onClick={()=>deleteRequest(request._id)}>Decline</button>
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
        </>
    );
};

export default ReceiveRequest;

