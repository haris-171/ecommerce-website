import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCart(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const res = await axios.put(`http://localhost:5000/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setCart(res.data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCart(res.data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  };

  const cartItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #ddd'
  };

  const itemDetailsStyle = {
    flex: 2
  };

  const quantityControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const buttonStyle = {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const removeButtonStyle = {
    backgroundColor: '#dc004e',
    color: 'white',
    border: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '1rem'
  };

  const checkoutButtonStyle = {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginTop: '2rem',
    width: '100%'
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <h2>Please login to view your cart</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={containerStyle}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Shopping Cart
      </h1>

      {cart.items.map(item => (
        <div key={item.product._id} style={cartItemStyle}>
          <div style={itemDetailsStyle}>
            <h3>{item.product.title}</h3>
            <p>Price: ${item.product.price}</p>
          </div>
          
          <div style={quantityControlStyle}>
            <button 
              style={buttonStyle}
              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              style={buttonStyle}
              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
            >
              +
            </button>
            <button 
              style={removeButtonStyle}
              onClick={() => removeItem(item.product._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <h2>Total: ${calculateTotal().toFixed(2)}</h2>
        <button 
          style={checkoutButtonStyle}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;