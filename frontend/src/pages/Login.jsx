import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: '#1F2937',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #374151'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const logoStyle = {
    width: '48px',
    height: '48px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#9CA3AF',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#374151',
    border: '1px solid #4B5563',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(45deg, #FF0050, #00F2EA)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginBottom: '16px'
  };

  const toggleStyle = {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: '14px'
  };

  const linkStyle = {
    color: '#00F2EA',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const errorStyle = {
    backgroundColor: '#EF4444',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.username, formData.password);
        if (result.success) {
          // Auto login after successful registration
          const loginResult = await login(formData.email, formData.password);
          result = loginResult;
        }
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#6366f1"/>
            </svg>
          </div>
          <h1 style={titleStyle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={subtitleStyle}>
            {isLogin ? 'Sign in to your TikAnalytics account' : 'Sign up to get started'}
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          
          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.opacity = 0.8}
            onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={toggleStyle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={linkStyle}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}
