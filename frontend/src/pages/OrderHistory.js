import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my-orders', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      default: return '📝';
    }
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem'
  };

  const orderCardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  const orderIdStyle = {
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem'
  };

  const statusBadgeStyle = (status) => ({
    backgroundColor: getStatusColor(status),
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px dashed #e0e0e0'
  };

  const totalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '2px solid #f0f0f0',
    marginTop: '1rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    color: '#7f8c8d'
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Please login to view your orders</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Loading orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Order History</h2>
        <div style={emptyStyle}>
          <h3>No orders yet</h3>
          <p>Start shopping to place your first order!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Order History</h1>

      {orders.map(order => (
        <div 
          key={order._id} 
          style={orderCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          <div style={orderHeaderStyle}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>Order</h3>
                <span style={orderIdStyle}>#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <p style={{ margin: '0.5rem 0 0', color: '#7f8c8d' }}>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div style={statusBadgeStyle(order.status)}>
              <span>{getStatusIcon(order.status)}</span>
              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
          </div>

          <div>
            {order.items.map((item, index) => (
              <div key={index} style={itemStyle}>
                <div>
                  <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                    {item.product?.title || 'Product'}
                  </span>
                  <span style={{ color: '#7f8c8d', marginLeft: '0.5rem' }}>
                    x {item.quantity}
                  </span>
                </div>
                <span style={{ fontWeight: '500', color: '#27ae60' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={totalStyle}>
            <span>Total Amount</span>
            <span style={{ color: '#27ae60', fontSize: '1.2rem' }}>
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
              💵 Payment Method: {order.paymentMethod}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
