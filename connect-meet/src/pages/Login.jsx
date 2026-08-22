import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const user = loginUser(email, password);
    if (!user) {
      setError('Invalid email or password!');
      return;
    }

      navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '340px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#38bdf8' }}>Login to ConnectMeet</h2>
        
        {error && (
          <div style={{ backgroundColor: '#ef444422', border: '1px solid #ef4444', color: '#f87171', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }} 
          />
          <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            Login
          </button>
        </form>
        <p style={{ marginTop: '1.2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}