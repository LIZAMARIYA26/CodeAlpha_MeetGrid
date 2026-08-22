import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Meeting() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // Mic level state (0 to 100)

  const [activePanel, setActivePanel] = useState('chat');
  const [messages, setMessages] = useState([
    { sender: 'System', text: `Welcome to room: ${roomId}` }
  ]);
  const [chatInput, setChatInput] = useState('');

  // 1. Initial Media Stream Access
  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera/Microphone access error:", err);
      }
    }
    getMedia();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Microphone Volume Level Meter (Web Audio API)
  useEffect(() => {
    if (!mediaStreamRef.current || !micOn) {
      setAudioLevel(0);
      return;
    }

    let animationFrameId;
    let audioContext;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
      source.connect(analyser);

      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {
      console.error("Audio Meter error:", e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
    };
  }, [micOn]);

  // 3. Complete Camera Hardware Toggle (Turns Off Camera Light)
  const toggleCam = async () => {
    if (camOn) {
      // Stop the hardware camera track directly to extinguish LED light
      if (mediaStreamRef.current) {
        const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
          mediaStreamRef.current.removeTrack(videoTrack);
        }
      }
      setCamOn(false);
    } else {
      // Re-acquire camera hardware
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = videoStream.getVideoTracks()[0];
        if (mediaStreamRef.current && newVideoTrack) {
          mediaStreamRef.current.addTrack(newVideoTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStreamRef.current;
          }
        }
        setCamOn(true);
      } catch (err) {
        console.error("Could not re-enable camera:", err);
      }
    }
  };

  // 4. Toggle Microphone Track
  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  const leaveCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/dashboard');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* Header */}
      <header style={{ height: '60px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', backgroundColor: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: '#38bdf8' }}>ConnectMeet</h3>
          <span style={{ backgroundColor: '#1e293b', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
            Room Code: <strong>{roomId}</strong>
          </span>
        </div>
        <button onClick={copyInviteLink} style={{ backgroundColor: copied ? '#16a34a' : '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
          {copied ? '✅ Link Copied!' : '📋 Copy Invite Link'}
        </button>
      </header>

      {/* Main Grid */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
          
          {/* Local User Tile */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', height: '100%', minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #334155' }}>
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: camOn ? 'block' : 'none' }}
            />
            {!camOn && (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0284c7', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                YOU
              </div>
            )}
            
            {/* Tile Info & Mic Level Bar */}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem' }}>You {micOn ? '🎙️' : '🔇'}</span>
              
              {/* Mic Visualizer Bar */}
              {micOn && (
                <div style={{ width: '50px', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${audioLevel}%`, height: '100%', backgroundColor: '#22c55e', transition: 'width 0.1s ease-out' }} />
                </div>
              )}
            </div>
          </div>

          {/* Remote Peer Placeholder */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed #475569', padding: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0 }}>👥 Waiting for others to join...</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Share code <strong>{roomId}</strong> with your team.</p>
          </div>

        </div>

        {/* Dynamic Panel */}
        {activePanel && (
          <aside style={{ width: '320px', backgroundColor: '#0f172a', borderLeft: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #1e293b' }}>
              <button onClick={() => setActivePanel('chat')} style={{ flex: 1, padding: '0.8rem', background: activePanel === 'chat' ? '#1e293b' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>💬 Chat</button>
              <button onClick={() => setActivePanel('whiteboard')} style={{ flex: 1, padding: '0.8rem', background: activePanel === 'whiteboard' ? '#1e293b' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>🎨 Board</button>
            </div>

            {activePanel === 'chat' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ backgroundColor: msg.sender === 'You' ? '#0284c7' : '#1e293b', padding: '0.6rem 0.8rem', borderRadius: '8px', alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block' }}>{msg.sender}</span>
                      <span style={{ fontSize: '0.9rem' }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Type a message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
                  <button type="submit" style={{ padding: '0.6rem 1rem', backgroundColor: '#0284c7', border: 'none', borderRadius: '6px', color: '#fff' }}>Send</button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Control Bar */}
      <footer style={{ height: '75px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleMic} style={{ backgroundColor: micOn ? '#334155' : '#ef4444', color: '#fff', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
          {micOn ? '🎙️ Mic On' : '🔇 Mic Off'}
        </button>
        <button onClick={toggleCam} style={{ backgroundColor: camOn ? '#334155' : '#ef4444', color: '#fff', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
          {camOn ? '📹 Cam On' : '📷 Cam Off'}
        </button>
        <button onClick={leaveCall} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
          📞 Leave Call
        </button>
      </footer>

    </div>
  );
}