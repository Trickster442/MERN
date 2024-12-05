import React, { useState } from 'react';
import '../styles/login.css';
import api from "../axios/configuration.js";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginHandle = async (e) => {
    e.preventDefault(); // Prevents form submission behavior (page reload)

    try {
      // Send the login request to the backend
      const response = await api.post('/api/login', { email, password });

      console.log(response.data); // Log the response to check for token

      if (response.data.accessToken) {
        // If token exists, store it in localStorage
        localStorage.setItem('token', response.data.accessToken);
        navigate('/');
      } else {
        console.log("Token not available");
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Optional: Handle error display (e.g., show a toast or error message)
    }
  };

  return (
    <div className='container'>
      <div className="login">
        <h3 className="login-header">Social Network</h3>
        <h6 className="login-subheader">Login</h6>
        <div className="login-data">
          <form onSubmit={loginHandle} autoComplete="off">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
            <button type="submit" className="login-dataformemail">LOG IN</button>
            <p>Don't have an account? <Link to='/register' className='register-button'>Register</Link> </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
