import React from 'react';
import './Navbar.style.css';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ tipoMenu, handleMenu }) => {
    function logout() {
        Cookies.remove('token');
        window.location.reload();
    }

    const token = Cookies.get('token');
    const tokenObject = token ? JSON.parse(token) : null;

    console.log(tokenObject?.lastName);
    console.log(tokenObject?.role);

    return (
        <div className="navbar">
            <button className="btn-menu" onClick={handleMenu}>
                <i className="fas fa-bars"></i>
            </button>

            <h2>HEALTH HUB</h2>

            <div className="dropdown">
                <button
                    className="btn btn"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {tokenObject ? (
                        <h5>
                            {tokenObject.lastName}&nbsp;&nbsp;
                            <i className="fas fa-caret-down"></i>
                        </h5>
                    ) : (
                        'Loading user data...'
                    )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                        <a className="dropdown-item" href="ChangePassword">
                            Setting
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={logout}>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
