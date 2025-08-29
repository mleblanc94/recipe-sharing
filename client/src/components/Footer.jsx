import React from 'react';
import 'tachyons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Recipe Sharing Hub. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
