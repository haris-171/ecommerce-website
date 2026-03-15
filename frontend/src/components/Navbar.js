import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    backgroundColor: '#2c3e50',
    padding: '1rem 2rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const userNameStyle = {
    backgroundColor: '#3498db',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={logoStyle}>
          🛍️ MyShop
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!user ? (
          // Show these links when user is NOT logged in
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/products" style={linkStyle}>Products</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        ) : (
          // Show these links when user IS logged in
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/products" style={linkStyle}>Products</Link>
            <Link to="/cart" style={linkStyle}>🛒 Cart</Link>
            <Link to="/orders" style={linkStyle}>📦 Orders</Link>
            <Link to="/wishlist" style={linkStyle}>❤️ Wishlist</Link>
            
            {user.isAdmin && (
              <Link to="/admin" style={linkStyle}>⚙️ Admin</Link>
            )}
            
            <div style={userInfoStyle}>
              <span style={userNameStyle}>
                👤 {user.name}
              </span>
              <button 
                onClick={handleLogout}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                  e.target.style.borderColor = '#e74c3c';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'white';
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
