import React, { useState } from 'react';
import '../styles/register.css';
import api from "../axios/configuration.js";
import { Link, useNavigate } from 'react-router-dom';

const Registerr = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(''); // Track selected gender

  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Function to handle capitalization
  const handleChangeToUpperCase = (setterFunction) => (e) => {
    setterFunction(e.target.value.toUpperCase());
  };

  const registerHandle = async (e) => {
    e.preventDefault(); 

    try {
      // Send data to the backend registration endpoint
      const response = await api.post('/api/register', {
        username,
        fullname,
        email,
        password,
        gender,
      });

      console.log(response.data);

      // Redirect to homepage after successful registration
      navigate('/');  // Navigate to the homepage (or any route you want)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='register'>
      <h3 className='register-header'>Social Network</h3>
      <h6 className='register-subheader'>Register</h6>
      <div className='register-data'>
        <form onSubmit={registerHandle}>
          <input 
            type='text' 
            value={username}
            onChange={handleChangeToUpperCase(setUsername)} 
            placeholder='Your username' 
            required
          />
          <input 
            type='text' 
            value={fullname}
            onChange={handleChangeToUpperCase(setFullname)} 
            placeholder='Your Fullname' 
            required
          />
          <input 
            type='email' 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder='Your email' 
            required
          />
          <input 
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Your password' 
            required
          />

          {/* Gender Selection - Dropdown */}
          <div>
            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              name="gender" 
              value={gender}
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button type='submit' className='register-form-submit'>
            REGISTER
          </button> 
          <small>Already have an account? <Link to='/login'>LOGIN HERE</Link></small>
        </form>
      </div>
    </div>
  );
};

export default Registerr;
