import React, { useState } from 'react';

const Register = ({ onToggle }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess('Registration successful! You can now sign in.');
        setFormData({ username: '', password: '', role: 'user' });
        setTimeout(() => {
          onToggle(); // automatically switch to login view
        }, 2000);
      } else {
        const errText = await response.text();
        setError(errText || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-heading">Create Account</h2>
      <p className="auth-subheading">Sign up to get started immediately</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px' }}>{success}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="••••••••"
            required 
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Role</label>
          <select 
            id="role" 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? 
        <button onClick={onToggle} className="auth-switch-link" disabled={loading}>Sign in</button>
      </div>
    </>
  );
};

export default Register;
