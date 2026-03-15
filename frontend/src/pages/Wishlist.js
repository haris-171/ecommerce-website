import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/wishlist', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setWishlist(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(`/api/wishlist/remove/${productId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setWishlist(res.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart/add', 
        { productId, quantity: 1 },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert('✅ Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem'
  };

  const productCardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const productImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '0.5rem'
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Please login to view your wishlist</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Loading wishlist...</h2>
      </div>
    );
  }

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Your Wishlist is Empty</h2>
        <p style={{ textAlign: 'center' }}>
          <Link to="/products" style={{ color: '#3498db' }}>Browse Products</Link> to add items to your wishlist!
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>My Wishlist ❤️</h1>
      
      <div style={gridStyle}>
        {wishlist.products.map(product => (
          <div key={product._id} style={productCardStyle}>
            <button 
              style={removeButtonStyle}
              onClick={() => removeFromWishlist(product._id)}
              title="Remove from wishlist"
            >
              ✕
            </button>
            
            <img 
              src={product.image || 'https://via.placeholder.com/300'} 
              alt={product.title}
              style={productImageStyle}
            />
            
            <h3>{product.title}</h3>
            <p style={{ color: '#7f8c8d' }}>${product.price.toFixed(2)}</p>
            
            <button 
              style={buttonStyle}
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
