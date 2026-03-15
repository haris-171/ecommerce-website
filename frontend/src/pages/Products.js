import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('default');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, priceRange, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    // First filter
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesPrice;
    });

    // Then sort
    if (sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(filtered);
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking button
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/cart/add', 
        { productId, quantity: 1 },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert('✅ Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Failed to add to cart');
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const filterStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const searchInputStyle = {
    flex: 2,
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minWidth: '250px',
    fontSize: '1rem'
  };

  const selectStyle = {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    minWidth: '150px',
    fontSize: '1rem'
  };

  const priceInputStyle = {
    width: '100px',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
  };

  const productsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  };

  const productCard = {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    cursor: 'pointer'
  };

  const productImage = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  const priceStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '1rem 0'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  };

  const resultsCountStyle = {
    textAlign: 'right',
    marginBottom: '1rem',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center' }}>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
        Our Products
      </h1>

      {/* Search and Filter Section */}
      <div style={filterStyle}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="default">Sort by: Default</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💰 Price:</span>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            style={priceInputStyle}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            style={priceInputStyle}
          />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#7f8c8d' }}>
          No products match your criteria.
        </p>
      ) : (
        <>
          <div style={resultsCountStyle}>
            Found {filteredProducts.length} products
          </div>
          <div style={productsGrid}>
            {filteredProducts.map(product => (
              <div 
                key={product._id} 
                style={productCard}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <img 
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.title}
                  style={productImage}
                />
                <h3 style={{ margin: '0.5rem 0', color: '#2c3e50' }}>{product.title}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                  {product.description.substring(0, 80)}...
                </p>
                <div style={priceStyle}>${product.price.toFixed(2)}</div>
                <button 
                  style={buttonStyle}
                  onClick={(e) => addToCart(product._id, e)}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.backgroundColor = '#2980b9';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.backgroundColor = '#3498db';
                  }}
                >
                  Add to Cart 🛒
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;