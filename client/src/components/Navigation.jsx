import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../utils/auth';
import 'tachyons';
import './Navigation.css';

import Logo1 from '../assets/logo_image.jpg';
import Logo2 from '../assets/logo_image2.webp';
import Logo3 from '../assets/logo_image3.webp';
import Logo4 from '../assets/logo_image4.jpeg';
import Logo5 from '../assets/logo_image5.jpg';
import Logo6 from '../assets/logo_image6.jpg';
import Logo7 from '../assets/logo_image7.jpg';

const Navigation = () => {
  const location = useLocation();
  const isCurrentPage = (link) => location.pathname === link;

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
  };

  const NavLink = ({ to, children, className = '', ...props }) => (
    <Link to={to}
    {...props}
    className={`nav-link ${isCurrentPage(to) ? 'active' : ''} ${className}`}>
      {children}
    </Link>
  );

  return (
    <nav className="app-nav">
      <div className="nav-inner">
        {/* LEFT: logo strip */}
        <div className="logo-strip">
          {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7].map((src, i) => (
            <img key={i} src={src} alt={`logo ${i + 1}`} />
          ))}
        </div>

        {/* RIGHT: links / actions */}
        <div className="nav-actions">
          {Auth.loggedIn() ? (
            <>
              <NavLink to="/" data-testid="nav-home">Home</NavLink>
              <NavLink to="/create" data-testid="nav-create">Create</NavLink>
              <NavLink to="/profile" data-testid="nav-profile">Profile</NavLink>
              <button className="btn logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn small">Login</Link>
              <Link to="/signup" className="btn secondary small">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;