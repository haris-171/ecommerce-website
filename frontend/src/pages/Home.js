import React from 'react';

const Home = () => {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const heroStyle = {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '4rem',
    textAlign: 'center',
    borderRadius: '8px',
    marginBottom: '2rem'
  };

  const aboutStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginTop: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to MyShop
        </h1>
        <p style={{ fontSize: '1.2rem' }}>
          Your One-Stop Shop for Amazing Products
        </p>
      </div>

      <div style={aboutStyle}>
        <div>
          <h2>About Us</h2>
          <p>
            We are passionate about providing the best quality products to our customers.
            Our journey started in 2024 with a simple mission: to make online shopping
            easy, affordable, and enjoyable for everyone.
          </p>
        </div>
        
        <div>
          <h2>Why Choose Us?</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ High-quality products</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Fast shipping</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ 24/7 customer support</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Easy returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
