import React, { useState } from 'react';

const Login = ({ onToggle, onAuth }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        // Invoke onAuth with the user info
        onAuth({ username: credentials.username, role: data.role });
      } else {
        const errText = await response.text();
        setError(errText || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-heading">Welcome Back</h2>
      <p className="auth-subheading">Enter your credentials to access your account</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={credentials.username}
            onChange={handleChange}
            className="form-input"
            placeholder="johndoe"
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
            placeholder="••••••••"
            required 
            disabled={loading}
          />
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-switch">
        Don't have an account? 
        <button onClick={onToggle} className="auth-switch-link" disabled={loading}>Sign up</button>
      </div>
    </>
  );
};

export default Login;
