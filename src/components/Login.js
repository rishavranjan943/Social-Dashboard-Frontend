import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const { auth, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  if (auth.isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
