import React from 'react';
import FFButton, { FFAddButton, FFEditButton, FFDeleteButton, FFSaveButton, FFCancelButton } from './FFButton';
import { useSound } from '../hooks/useSound';
import audioManager from '../utils/audioManager';

/**
 * Demo component to showcase Final Fantasy-style button animations and sounds
 */
const ButtonDemo = () => {
  const { volume, setVolume, isMuted, toggleMute, playSound } = useSound();

  const handleDemoClick = (buttonType) => {
    console.log(`${buttonType} button clicked!`);
  };

  const testSound = async (soundName) => {
    console.log(`Testing sound: ${soundName}`);
    try {
      await playSound(soundName);
      console.log(`Sound ${soundName} played successfully`);
    } catch (error) {
      console.error(`Failed to play sound ${soundName}:`, error);
    }
  };

  const initializeAudio = async () => {
    console.log('Manually initializing audio system...');
    try {
      await audioManager.initializeAudioContext();
      await audioManager.preloadSounds();
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
        🎮 Final Fantasy Button Demo
      </h3>
      
      {/* Audio Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        color: '#fff'
      }}>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
        <span>{Math.round(volume * 100)}%</span>
        <button
          onClick={toggleMute}
          style={{
            background: 'none',
            border: '1px solid #fff',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={initializeAudio}
          style={{
            background: '#10b981',
            border: 'none',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎵 Init Audio
        </button>
      </div>

      {/* Sound Test Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {['hover', 'click', 'success', 'error', 'magic'].map(soundName => (
          <button
            key={soundName}
            onClick={() => testSound(soundName)}
            style={{
              background: '#4f46e5',
              border: 'none',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Test {soundName}
          </button>
        ))}
      </div>

      {/* Button Showcase */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <FFAddButton onClick={() => handleDemoClick('Add')}>
          Add Item
        </FFAddButton>
        
        <FFEditButton onClick={() => handleDemoClick('Edit')}>
          Edit
        </FFEditButton>
        
        <FFDeleteButton onClick={() => handleDemoClick('Delete')}>
          Delete
        </FFDeleteButton>
        
        <FFSaveButton onClick={() => handleDemoClick('Save')}>
          Save
        </FFSaveButton>
        
        <FFCancelButton onClick={() => handleDemoClick('Cancel')}>
          Cancel
        </FFCancelButton>
      </div>

      {/* Special Effect Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <FFButton 
          variant="primary" 
          pulse 
          onClick={() => handleDemoClick('Pulse')}
        >
          ✨ Pulse Effect
        </FFButton>
        
        <FFButton 
          variant="success" 
          sparkle 
          onClick={() => handleDemoClick('Sparkle')}
        >
          🌟 Sparkle Magic
        </FFButton>
        
        <FFButton 
          variant="danger" 
          size="large"
          onClick={() => handleDemoClick('Large')}
        >
          🔥 Large Button
        </FFButton>
        
        <FFButton 
          variant="secondary" 
          size="small"
          onClick={() => handleDemoClick('Small')}
        >
          Small
        </FFButton>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <p><strong>🎵 Hover over buttons to hear sound effects!</strong></p>
        <p>Each button type has unique hover and click sounds. The app generates synthetic sounds using Web Audio API.</p>
        <p>✨ Special effects include pulsing glow and sparkle animations</p>
      </div>
    </div>
  );
};

export default ButtonDemo;
