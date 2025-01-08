import React, {useState} from "react";
import "../styles/header.css";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import BusinessMenu from "./businessMenu";
const Header = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false)

const toggleMenu = () =>{
  //change what its previous state to opposite
  setIsMenuOpen((prev) => !prev);
}
const toggleBusinessMenu = ()=>{
  setIsBusinessMenuOpen((prev) => !prev);
}

const closeBusinessMenu = ()=>{
  setIsBusinessMenuOpen(false);
}
const closeMenu = ()=>{
  setIsMenuOpen(false);
}

  return (
    <header className="header-container">
      {/* Logo and Search */}
    <div className="secondary-container">

      <div className="logo-part-container">
        <div className="logo" aria-label="Company Logo">
          <h2><Link to="/">logo</Link></h2>
        </div>
        <form className="search-box" role="search">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>{" "}
            <input type="text" placeholder="Search" aria-label="Search" />
          </div>
        </form>
      </div>

      {/* Navigation Links */}
      <nav className="navigation-part-container">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="/network">My Network</a>
          </li>
          <li>
            <Link to="/friendRequest">Requests</Link>
          </li>
          <li>
            <a href="#messaging">Messaging</a>
          </li>
          <li>
            <a href="#notifications">Notifications</a>
          </li>
          <li>
            <button onClick={toggleMenu} className="me-button">Me</button>
            <Menu isOpen={isMenuOpen} closeMenu={closeMenu}/>
          </li>
        </ul>
      </nav>
      <hr></hr>
    </div>
      {/* Last Part */}
      <div className="last-part-container">
        <ul>
          <li>
            <button onClick={toggleBusinessMenu} className="business-button">For Business</button>
            <BusinessMenu isMenuOpen={isBusinessMenuOpen} closeMenu={closeBusinessMenu}/>
          </li>
          <li>
            <a href="#try">Try</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
