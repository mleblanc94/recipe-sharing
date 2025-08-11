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

    const isCurrentPage = (link) => {
        return location.pathname === link;
    }

    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };

    return (
        <nav>
            <ul className="flex justify-between list ma0 sans-serif f3 lh-copy pv3 links-ul" >
            <li>
                <img src={Logo1} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo2} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo3} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo4} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo5} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo6} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            <li>
                <img src={Logo7} height="100px" width="150px" alt="logo" 
                className="shadow-lg p-1 mb-1 bg-white rounded" />
            </li>
            {
                Auth.loggedIn() ? (
                    <>
                    <li>
                        <Link to="/" className={`near-white ${isCurrentPage('/') ? 'fw8' : ''}`} >
                        Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/create" className={`near-white ${isCurrentPage('/create') ? 'fw8' : ''}`}>
                        Create
                        </Link> 
                    </li>
                    <li>
                        <Link to="/profile" className={`near-white ${isCurrentPage('/profile') ? 'fw8' : ''}`}>
                        Profile
                        </Link>
                    </li>
                    <li>
                        <div>
                            <button className="btn btn-lg btn-light m-2" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </li>
                    </>
                ) : (
                    <>
                    <li>
                        <div>
                            <Link to="/signin">  
                                <button className="btn btn-lg btn-info m-3 signin-button" to="/signin">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup" >
                                <button className="btn btn-lg btn-info m-3 signup-button" to="/signup">
                                    Signup
                                </button>
                            </Link>
                        </div>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navigation;