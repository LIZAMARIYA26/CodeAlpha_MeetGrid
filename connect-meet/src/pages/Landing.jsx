import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 3rem', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>ConnectMeet</h2>
        <div>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem', fontWeight: '500' }}>Login</Link>
          <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          Real-Time Video Calls & Seamless Collaboration
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2.5rem' }}>
          Connect with team members, share screens, sketch on an interactive whiteboard, and share files in one secure platform.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#fff', padding: '0.8rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Start a Free Meeting
          </Link>
          <Link to="/login" style={{ border: '1px solid #334155', color: '#fff', padding: '0.8rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1.1rem' }}>
            Join with Code
          </Link>
        </div>
      </div>
    </div>
  );
}