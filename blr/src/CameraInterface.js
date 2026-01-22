import React, { useRef, useState } from 'react';
import './App.css'; 
import { motion } from 'framer-motion';
import LiquidEther from './components/LiquidEther.js';

const IconPerson = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconPalette = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>);
const IconImage = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const IconPlay = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>);
const IconPause = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const IconSettings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);
const IconOBS = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
  </svg>
);

const CameraInterface = ({ onClose }) => {
  const colorInputRef = useRef(null); 
  const fileInputRef = useRef(null);
  const appliedColorRef = useRef(null);
  const openedColorRef = useRef(null); 
  const previewColorRef = useRef(null); 
  const appliedModeRef = useRef('original');
  const openedModeRef = useRef('original'); 
  const committedRef = useRef(false); 
  const hadColorOnOpenRef = useRef(false); 
  const initialPickerValueRef = useRef('#00FF00'); 

  const normalizeColor = (val) => (val || '').toLowerCase();
  
  const [consentGiven, setConsentGiven] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [obsRunning, setObsRunning] = useState(false);
  const [obsAvailable, setObsAvailable] = useState(false);
  const SERVER_URL = "http://localhost:5000"; 

  const setMode = async (modeName) => {
    try {
      await fetch(`${SERVER_URL}/set_mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeName })
      });
      appliedModeRef.current = modeName;
    } catch (err) { console.error("Error setting mode:", err); }
  };

  const handleColorPreview = async (event) => {
    const selectedColor = normalizeColor(event.target.value);
    const openedColor = normalizeColor(openedColorRef.current);
    const initialColor = normalizeColor(initialPickerValueRef.current);
    const previewColor = normalizeColor(previewColorRef.current);
    if (selectedColor === previewColor) return;
    if (selectedColor === openedColor) return;
    if (!hadColorOnOpenRef.current && selectedColor === initialColor) return;

    try {
      await fetch(`${SERVER_URL}/set_color`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: selectedColor })
      });
      previewColorRef.current = selectedColor;
    } catch (err) { console.error("Error setting color:", err); }
  };

  const handleColorChangeCommit = async (event) => {
    const finalColor = normalizeColor(event.target.value);
    const initialColor = normalizeColor(initialPickerValueRef.current);
    const openedColor = normalizeColor(openedColorRef.current);
    const previewColor = normalizeColor(previewColorRef.current);

    if (!hadColorOnOpenRef.current && finalColor === initialColor) {
      committedRef.current = false;
      return;
    }

    if (finalColor === openedColor) {
      return;
    }
    committedRef.current = true;

    if (finalColor !== previewColor) {
      try {
        await fetch(`${SERVER_URL}/set_color`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color: finalColor })
        });
      } catch (err) { console.error("Error setting color:", err); }
    }

    appliedColorRef.current = finalColor;
    appliedModeRef.current = 'color';
    previewColorRef.current = finalColor;
    openedColorRef.current = finalColor;
  };

  const handleColorPickerClose = async () => {
    if (committedRef.current) return;

    if (hadColorOnOpenRef.current && openedModeRef.current === 'color') {
      previewColorRef.current = openedColorRef.current;
      appliedModeRef.current = openedModeRef.current;
      return;
    }

    try {
      await setMode('original');
      appliedModeRef.current = 'original';
      openedModeRef.current = 'original';
      previewColorRef.current = null;
      openedColorRef.current = null;
    } catch (err) { console.error("Error reverting to original mode:", err); }
  };

  const openColorPicker = () => {
    if (!colorInputRef.current) return;
    committedRef.current = false;
    hadColorOnOpenRef.current = appliedColorRef.current !== null;
    const fallback = normalizeColor(appliedColorRef.current || '#00FF00');
    initialPickerValueRef.current = fallback;
    colorInputRef.current.value = fallback;
    openedColorRef.current = appliedColorRef.current; 
    previewColorRef.current = openedColorRef.current; 
    openedModeRef.current = appliedModeRef.current;
    colorInputRef.current.focus({ preventScroll: true });
    colorInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await fetch(`${SERVER_URL}/upload_bg`, {
        method: 'POST',
        body: formData
      });
    } catch (err) { console.error("Error uploading image:", err); }
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleConsent = (agree) => {
    if (agree) {
      setConsentGiven(true);
      setIsPlaying(true);
      checkObsStatus();
    } else if (onClose) {
      onClose();
    }
  };

  const checkObsStatus = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/obs/status`);
      const data = await response.json();
      setObsAvailable(data.available);
      setObsRunning(data.running);
    } catch (err) { console.error("Error checking OBS status:", err); }
  };

  const handleStartOBS = async () => {
    if (!isPlaying) {
      alert('First play stream wideo (click Play)');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/obs/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_index: 1 }) 
      });
      const data = await response.json();
      if (response.ok) {
        setObsRunning(true);
        alert('Virtual OBS camera started');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error starting OBS:", err);
      alert(' Cannot start virtual OBS camera');
    }
  };

  const handleStopOBS = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/obs/stop`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        setObsRunning(false);
        alert('Virtual OBS camera stopped');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error stopping OBS:", err);
      alert(' Cannot stop virtual OBS camera');
    }
  };

  return (
    <div className="app-container">
      
      <button className="close-button" onClick={onClose}>&times;</button>

      <div className="video-feed">
        {obsRunning && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'white',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            OBS LIVE
          </div>
        )}

        {consentGiven ? (
          isPlaying ? (
            <img 
              src={`${SERVER_URL}/video_feed`} 
              alt="Live AI Feed"
              className="video-stream"
              onLoad={() => console.log(" Stream loaded!")}
              onError={(e) => console.error("Error:", e)}
              style={{ width: '100%', height:  '100%', objectFit: 'contain' }}
            />
          ) : (
            <div 
              className="paused-overlay" 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.65)',
                color: 'white',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', inset: 0 }}>
                <LiquidEther
                  colors={['#0b1020', '#2c2f3a', '#ffffff']}
                  mouseForce={80}
                  cursorSize={160}
                  resolution={0.6}
                  autoDemo={true}
                  autoSpeed={0.5}
                  autoIntensity={2.2}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontSize: 18,
                  letterSpacing: '0.08em',
                  color: '#f5f7ff',
                  textShadow: `
                    -1px -1px 1px #0b1020,
                    1px -1px 1px #0b1020,
                    -1px 1px 1px #0b1020,
                    1px 1px 1px #0b1020,
                    0 0 8px rgba(0,0,0,0.6)
                  `
                }}
              >
                Stream paused
              </div>
            </div>
          )
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
        )}
      </div>

      {/* MODAL CONSENT */}
      {!consentGiven && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px',
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            color: '#1a1a1a',
            textAlign: 'left'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', lineHeight: 1.2 }}>
              Consent
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4b5563', marginBottom: '32px' }}>
              To continue, we need your consent to start the camera. The video feed will be processed only for background blurring.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Button: AGREE (Domyślnie czarny, hover biały) */}
              <motion.button
                onClick={() => handleConsent(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3.5 rounded-full font-bold text-[15px] border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors duration-300 shadow-md"
              >
                Agree
              </motion.button>
              
              {/* Button: REJECT (Domyślnie biały/szary, hover ciemniejszy) */}
              <motion.button
                onClick={() => handleConsent(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3.5 rounded-full font-bold text-[15px] border-2 border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-black transition-colors duration-300"
              >
                Reject
              </motion.button>

            </div>
          </div>
        </div>
      )}

      <div className="controls-bar">
        <input 
          type="color" 
          ref={colorInputRef} 
          style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', opacity: 0 }} 
          onInput={handleColorPreview}
          onChange={handleColorChangeCommit}
          onBlur={handleColorPickerClose}
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleImageUpload} 
        />

        <button 
          className="control-button" 
          onClick={handleTogglePlay} 
          data-tooltip={isPlaying ? "Pause" : "Play"}
          disabled={!consentGiven}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        
        <button 
          className="control-button" 
          onClick={() => setMode('blur')} 
          disabled={!isPlaying}
          data-tooltip="Blur">
          <IconPerson />
        </button>
        
        <button className="control-button" disabled={!isPlaying} onClick={openColorPicker} data-tooltip="Change color">
          <IconPalette />
        </button>
        
        <button className="control-button" disabled={!isPlaying} onClick={() => fileInputRef.current.click()} data-tooltip="Upload">
          <IconImage />
        </button>
        
        <button className="control-button" disabled={!isPlaying} onClick={() => setMode('original')} data-tooltip="Reset">
          <IconSettings />
        </button>

        <div style={{ width: '1px', height: '32px', background: '#333', margin: '0 8px' }}></div>

        {obsAvailable ? (
          <button 
            className="control-button" 
            onClick={obsRunning ? handleStopOBS : handleStartOBS}
            data-tooltip={obsRunning ? "Stop OBS Camera" : "Start OBS Camera"}
            disabled={!consentGiven}
            style={{
              background: obsRunning ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none'
            }}
          >
            <IconOBS />
          </button>
        ) : (
          <button 
            className="control-button" 
            disabled
            data-tooltip="OBS not available (install pyvirtualcam)"
            style={{ opacity: 0.3 }}
          >
            <IconOBS />
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraInterface;