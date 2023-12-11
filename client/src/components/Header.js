import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

import '../css/header.css'


export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  }

  return (
    <div className='header_class'>
      <h1><Link to="/">Work In Proress </Link></h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {user && <li onClick={handleLogout}>Logout</li>}
          {!user && <li><Link to="/login">Login</Link></li>}
          {!user && <li><Link to="/register">Registration</Link></li>}
        </ul>
      </nav>
    </div>
  );
}