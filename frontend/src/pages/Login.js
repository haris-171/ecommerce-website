import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/products');
    } else {
      setError(result.error);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
