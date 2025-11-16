import React, { useRef, useEffect } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    const currentVideoRef = videoRef.current;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; 
        
        if (currentVideoRef) {
          currentVideoRef.srcObject = stream;
          currentVideoRef.play();
        }
      } catch (err) {
        console.error("No access", err);
        alert("Check the settings of the camera.");
      }
    };

    startCamera();
    return () => {
      if (streamRef.current) { 
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // Opcjonalne: resetuje referencję
    }
 if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null; 
    }
    
    alert("Kamera została zamknięta. Funkcja zamykania aplikacji.");
  };

  return (
    <div className="app-container">
      {/* przycisk zamykania */}
      <button className="close-button" onClick={handleClose}>
        &times;
      </button>

      {/* obraz z kam */}
      <div className="video-feed">
        <video ref={videoRef} autoPlay playsInline muted />
      </div>

      {/* pasek kontrolny */}
      <div className="controls-bar">
        <button className="control-button">▶</button>
        <button className="control-button">?</button>
        <button className="control-button">?</button>
        <button className="control-button">?</button>
        <button className="control-button">?</button>
      </div>
    </div>
  );
}

export default App;