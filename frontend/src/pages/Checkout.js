import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCart(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      await axios.post('/api/orders', 
        { paymentMethod: 'Cash on Delivery' },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setProcessing(false);
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

  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem'
  };

  const orderSummaryStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #e0e0e0'
  };

  const itemDetailsStyle = {
    flex: 2
  };

  const totalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderTop: '2px solid #e0e0e0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  const paymentMethodStyle = {
    backgroundColor: '#e8f5e9',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    border: '1px solid #c8e6c9'
  };

  const buttonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    width: '100%',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#219a52'
    }
  };

  const successStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '12px',
    border: '1px solid #c3e6cb'
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Please login to checkout</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Loading...</h2>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={containerStyle}>
        <div style={successStyle}>
          <h2>✅ Order Placed Successfully!</h2>
          <p>Thank you for your purchase. You will be redirected to products page.</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Your cart is empty</h2>
        <button 
          onClick={() => navigate('/products')}
          style={{...buttonStyle, backgroundColor: '#3498db'}}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Checkout</h1>

      <div style={orderSummaryStyle}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Order Summary</h2>
        
        {cart.items.map(item => (
          <div key={item.product._id} style={itemStyle}>
            <div style={itemDetailsStyle}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>{item.product.title}</h3>
              <p style={{ margin: '0.25rem 0 0', color: '#7f8c8d' }}>
                Quantity: {item.quantity}
              </p>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        <div style={totalStyle}>
          <span>Total Amount:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>

        <div style={paymentMethodStyle}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#2c3e50' }}>Payment Method</h3>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💵</span> Cash on Delivery
          </p>
        </div>

        <button 
          style={buttonStyle}
          onClick={handleCheckout}
          disabled={processing}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#219a52'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
        >
          {processing ? 'Processing...' : 'Place Order'}
        </button>

        <button 
          onClick={() => navigate('/cart')}
          style={{
            ...buttonStyle,
            backgroundColor: '#95a5a6',
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7f8c8d'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#95a5a6'}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;
