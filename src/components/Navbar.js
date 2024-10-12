import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css'; 
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Social Dashboard
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobile ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`navbar-links ${isMobile ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsMobile(false)}>Home</Link>
          </li>
          {!auth.isAuthenticated ? (
            <li>
              <Link to="/login" onClick={() => setIsMobile(false)}>Admin Login</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/admin" onClick={() => setIsMobile(false)}>Admin Dashboard</Link>
              </li>
              <li>
                <button onClick={() => { handleLogout(); setIsMobile(false); }} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
