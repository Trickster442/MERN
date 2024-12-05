import React, { useRef, useEffect } from 'react';
import '../styles/businessMenu.css';

const BusinessMenu = ({ isMenuOpen, closeMenu }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleOutsideClick);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [closeMenu]); // `closeMenu` is a dependency to ensure it works correctly

  if (!isMenuOpen) return null; // Don't render if menu is not open

  return (
    <div className="menu-container" ref={menuRef}>
      <ul>
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
        <li>Language</li>
      </ul>
    </div>
  );
};

export default BusinessMenu;
