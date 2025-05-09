// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('userRole'); // 'hr' or 'employee'

  const handleLogout = () => {
    localStorage.clear(); // Clear saved user data
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Employee Directory</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {role === 'hr' && (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard/hr">Dashboard</Link>
            </li>
          )}
          {role === 'employee' && (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard/employee">Dashboard</Link>
            </li>
          )}
        </ul>
        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
