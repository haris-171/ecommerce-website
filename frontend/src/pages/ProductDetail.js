import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProductDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProductData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await axios.post('/api/cart/add', 
        { productId: id, quantity: 1 },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert('✅ Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Failed to add to cart');
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    
    try {
      await axios.post(`/api/wishlist/add/${id}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert('✅ Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const productContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    marginBottom: '2rem'
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const ratingStyle = {
    color: '#f39c12',
    fontSize: '1.2rem',
    marginBottom: '1rem'
  };

  const priceStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '1rem 0'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  };

  const cartButtonStyle = {
    flex: 2,
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem'
  };

  const wishlistButtonStyle = {
    flex: 1,
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!productData) {
    return (
      <div style={containerStyle}>
        <h2>Product not found</h2>
      </div>
    );
  }

  const { product, averageRating, reviewCount } = productData;

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '2rem',
          backgroundColor: '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <div style={productContainerStyle}>
        <div>
          <img src={product.image || 'https://via.placeholder.com/500'} alt={product.title} style={imageStyle} />
        </div>
        
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#2c3e50' }}>{product.title}</h1>
          
          <div style={ratingStyle}>
            {renderStars(averageRating)} ({reviewCount} reviews)
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#34495e', marginBottom: '1rem' }}>
            {product.description}
          </p>
          
          <div style={priceStyle}>${product.price.toFixed(2)}</div>
          
          <div style={buttonContainerStyle}>
            <button 
              style={cartButtonStyle}
              onClick={addToCart}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              🛒 Add to Cart
            </button>
            
            <button 
              style={wishlistButtonStyle}
              onClick={addToWishlist}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              ❤️ Wishlist
            </button>
          </div>
          
          {product.category && (
            <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
              Category: {product.category}
            </p>
          )}
        </div>
      </div>

      <ProductReviews productId={id} />
    </div>
  );
};

export default ProductDetail;
