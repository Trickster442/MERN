import React, { useState, useEffect } from 'react';
import api from '../axios/configuration.js';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode


const UserList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // Define an async function to fetch data
        const fetchUserList = async () => {
            try {
                const response = await api.get('/api/users');
                const lists = response.data.users;
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const loggedInUser = decoded.userId;

                    // Filter out the logged-in user
                    const newLists = lists.filter(user => user._id !== loggedInUser);
                    setUserList(newLists); // Update state with the filtered list
                } else {
                    setUserList(lists); // If no token, use the full list
                }
            } catch (error) {
                console.error("Error fetching user list:", error);
            }
        };

        // Call the async function
        fetchUserList();
    }, userList); // Empty dependency array ensures this runs only once on mount

    return (
    <>
        <div>
            <h1>This is the User List Page</h1>
            <ul>
                {userList.map(user => (
                    <li key={user._id}>
                        {user.fullname}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default UserList;
