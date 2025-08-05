import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthPage = () => {
  fetch('/api/current_user', { credentials: 'include' })
  const { setUser, setToken } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    if (isLogin) {
  // Login API call
  const res = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  setToken(data.token);
  setUser({ name: data.name });
  // Save token, redirect, etc.
  localStorage.setItem('token', data.token);
  localStorage.setItem('name', data.name);
  navigate('/');
  // Redirect or update UI as needed
    } else {
      // Signup API call
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      // Save token, redirect, etc.
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
       navigate('/');
      // Redirect or update UI as needed
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and image section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://img.icons8.com/fluency/96/dumbbell.png"
            alt="Fitness Guardian Logo"
            className="w-20 h-20 mb-2 drop-shadow-lg"
          />
          <span className="text-3xl font-extrabold text-orange-500 tracking-tight mb-1">FITNESS GUARDIAN</span>
          <span className="text-gray-400 text-sm mb-2">Shape Your Ideal Body</span>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Orange accent header */}
          <div className="bg-orange-500 -mt-12 rounded-lg py-4 px-6 text-white text-center mb-6 shadow-md">
            <h2 className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
          </div>

          {/* Tab Selection */}
          <div className="flex mb-8 border-b border-gray-700">
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${!isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Fields */}
          <form onSubmit={handleSubmit}>
            {/* Conditional Name field for Sign Up */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {/* Email field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Conditional Confirm Password field for Sign Up */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Login specific options */}
            {isLogin && (
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
                </div>
                <a href="#" className="text-sm text-orange-500 hover:text-orange-400">Forgot password?</a>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
            )}
            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-orange-500 py-3 rounded text-white font-medium transition-colors hover:bg-orange-600 mt-2"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex justify-center py-3 px-4 border border-gray-700 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="flex justify-center py-3 px-4 border border-gray-700 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544A8.127 8.127 0 0 1 5.5 16.898a5.778 5.778 0 0 0 4.252-1.189 2.879 2.879 0 0 1-2.684-1.995 2.88 2.88 0 0 0 1.298-.05 2.876 2.876 0 0 1-2.304-2.82c.366.203.784.324 1.226.337A2.876 2.876 0 0 1 6.47 7.896a8.147 8.147 0 0 0 5.92 3 2.876 2.876 0 0 1 4.895-2.619 5.74 5.74 0 0 0 1.824-.697 2.884 2.884 0 0 1-1.262 1.588 5.746 5.746 0 0 0 1.65-.454 5.834 5.834 0 0 1-1.43 1.482z" />
                </svg>
              </button>
              <button className="flex justify-center py-3 px-4 border border-gray-700 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;