import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logoutUser } from '../auth';

export default function Dashboard() {
  const [roomInput, setRoomInput] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setUser(getCurrentUser());
  }, [navigate]);

  const createNewMeeting = () => {
    const randomRoomId = Math.random().toString(36).substring(2, 7);
    navigate(`/meeting/${randomRoomId}`);
  };
  const handleScheduleMeeting = async (title, roomId, startTime) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.id) {
    alert('Please log in first');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/meetings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        roomId,
        hostId: user.id,
        startTime
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Meeting successfully stored in MongoDB!');
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Failed to store meeting:', err);
  }
};
  const joinMeeting = (e) => {
    e.preventDefault();
    if (!roomInput.trim()) return;
    navigate(`/lobby/${roomInput.trim()}`);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#38bdf8', margin: 0 }}>ConnectMeet</h2>
          {user && (
            <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Welcome, {user.name}
            </p>
          )}
        </div>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <main style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Premium Video Meetings</h1>
        <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Now free and available for everyone to collaborate seamlessly.</p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #334155' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Instant Meeting</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create a new room instantly and share the link with your team.</p>
            </div>
            <button onClick={createNewMeeting} style={{ marginTop: '1.5rem', padding: '0.8rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              ➕ Start New Meeting
            </button>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '300px', border: '1px solid #334155' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Join Meeting</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter a code or link to join an existing session.</p>
            <form onSubmit={joinMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input 
                type="text" 
                placeholder="Enter Room Code (e.g. abc12)" 
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Join Room
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}