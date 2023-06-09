import React, { useContext, useEffect } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

/**
 * Header component for the application.
 * @returns {JSX.Element} Header component.
 */
function Header() {
  const location = useLocation();
  const { isLoggedIn, toggleLogin } = useContext(AuthContext);

  /**
   * Handles the effect when the component mounts.
   * Checks if the user was previously logged in and toggles the login state accordingly.
   */
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login') {
      toggleLogin(false);
    }
  }, [location.pathname, toggleLogin]);

  /**
   * Handles the logout functionality.
   * Toggles the login state, clears local storage, and logs a message.
   */
  const handleLogout = () => {
    toggleLogin(false);
    localStorage.clear();
    console.log('Logout successful');
  };

  return (
    <div className="header-container">
      <header>
        <img className="logo" src="/logo.jpg" alt="LOGO" />
        <nav>
          <ul className="header-ul">
            {isLoggedIn ? (
              <>
                <li>
                  <Link onClick={handleLogout} to="/">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/sign-up">Sign up</Link>
                </li>
              </>
            )}
            <li>
              <a href="mailto:contact@apartmate.com">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
