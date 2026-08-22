import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Toggle Camera explicitly on user action
  const toggleCamera = async () => {
    if (camOn) {
      // Turn camera off and stop track
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
          streamRef.current.removeTrack(videoTrack);
        }
      }
      setCamOn(false);
    } else {
      // Request browser permission ONLY on click
      try {
        setPermissionRequested(true);
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        
        if (!streamRef.current) {
          streamRef.current = new MediaStream();
        }
        streamRef.current.addTrack(videoTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        setCamOn(true);
      } catch (err) {
        console.error("Camera permission denied:", err);
        alert("Camera permission was denied or device is unavailable.");
      }
    }
  };

  // Toggle Microphone explicitly on user action
  const toggleMicrophone = async () => {
    if (micOn) {
      // Mute/stop audio track
      if (streamRef.current) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.stop();
          streamRef.current.removeTrack(audioTrack);
        }
      }
      setMicOn(false);
    } else {
      // Request browser permission ONLY on click
      try {
        setPermissionRequested(true);
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = audioStream.getAudioTracks()[0];

        if (!streamRef.current) {
          streamRef.current = new MediaStream();
        }
        streamRef.current.addTrack(audioTrack);
        setMicOn(true);
      } catch (err) {
        console.error("Microphone permission denied:", err);
        alert("Microphone permission was denied or device is unavailable.");
      }
    }
  };

  const handleJoin = () => {
    // Stop local lobby tracks before passing initial states to meeting page
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    navigate(`/meeting/${roomId}`, { state: { initialMic: micOn, initialCam: camOn } });
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '0.5rem', color: '#38bdf8' }}>Ready to join?</h2>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Room Code: <strong>{roomId}</strong></p>

      {/* Video Preview Box */}
      <div style={{ width: '480px', height: '320px', backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #334155' }}>
        {camOn ? (
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
            <p style={{ margin: 0 }}>Camera is off</p>
            {!permissionRequested && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Click below to grant permission and enable device</p>
            )}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          {micOn ? '🎙️ Mic Active' : '🔇 Mic Off'}
        </div>
      </div>

      {/* Manual Control Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button 
          onClick={toggleMicrophone} 
          style={{ padding: '0.8rem 1.5rem', borderRadius: '30px', border: 'none', backgroundColor: micOn ? '#0284c7' : '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
          {micOn ? '🎙️ Mute Mic' : '🎙️ Allow & Turn On Mic'}
        </button>

        <button 
          onClick={toggleCamera} 
          style={{ padding: '0.8rem 1.5rem', borderRadius: '30px', border: 'none', backgroundColor: camOn ? '#0284c7' : '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
          {camOn ? '📹 Turn Off Camera' : '📷 Allow & Turn On Camera'}
        </button>

        <button 
          onClick={handleJoin} 
          style={{ padding: '0.8rem 2rem', borderRadius: '30px', border: 'none', backgroundColor: '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Join Now
        </button>
      </div>
    </div>
  );
}