import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/menu.css';

const Menu = ({ isOpen, closeMenu }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when component is unmounted or when isOpen changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  if (!isOpen) return null; // Don't render if menu is not open

  return (
    <div className="menu-container" ref={menuRef}>
      <ul>
        <li>Profile</li>
        <li>Settings</li>
        <li>
          <div className='logout-button'
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login'); // Navigate to login page after logout
            }}
            aria-label="Logout"
          >
            Logout
          </div>
        </li>
        <li>Language</li>
      </ul>
    </div>
  );
};

export default Menu;
