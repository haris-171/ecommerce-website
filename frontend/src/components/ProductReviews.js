import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setReviewCount(res.data.reviewCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to write a review');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, 
        newReview,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setNewReview({ rating: 5, comment: '' });
      fetchProductDetails();
      alert('✅ Review added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add review');
    }
    setSubmitting(false);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const containerStyle = {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const reviewCardStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #e0e0e0'
  };

  const ratingStyle = {
    color: '#f39c12',
    fontSize: '1.2rem',
    letterSpacing: '2px'
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={containerStyle}>
      <h3>Customer Reviews</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div style={ratingStyle}>{renderStars(Math.round(averageRating))}</div>
          <div style={{ color: '#7f8c8d' }}>{reviewCount} reviews</div>
        </div>
      </div>

      {user && (
        <form onSubmit={handleSubmitReview} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
          <h4>Write a Review</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label>Rating: </label>
            <select 
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
            >
              {[5,4,3,2,1].map(num => (
                <option key={num} value={num}>{num} stars {renderStars(num)}</option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            placeholder="Write your review here..."
            rows="3"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
          <button 
            type="submit" 
            disabled={submitting}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map(review => (
          <div key={review._id} style={reviewCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{review.userName}</strong>
              <span style={ratingStyle}>{renderStars(review.rating)}</span>
            </div>
            <p style={{ margin: 0 }}>{review.comment}</p>
            <small style={{ color: '#7f8c8d' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;