/**
 * Audio Manager for Final Fantasy-style sound effects
 * Handles audio loading, caching, and playback with Web Audio API fallback
 */

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.isMuted = false;
    this.isInitialized = false;
    
    // Initialize audio context on first user interaction
    this.initializeAudioContext();
  }

  async initializeAudioContext() {
    try {
      // Create audio context (will be suspended until user interaction)
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio:', error);
      this.isInitialized = false;
    }
  }

  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  async loadSound(name, url) {
    try {
      if (this.isInitialized && this.audioContext) {
        // Use Web Audio API for better control
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(name, { type: 'webaudio', buffer: audioBuffer });
      } else {
        // Fallback to HTML5 Audio
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = this.masterVolume;
        this.sounds.set(name, { type: 'html5', audio });
      }
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }

  async preloadSounds() {
    const soundFiles = [
      { name: 'hover', url: '/sounds/button-hover.mp3' },
      { name: 'click', url: '/sounds/button-click.mp3' },
      { name: 'success', url: '/sounds/button-success.mp3' },
      { name: 'error', url: '/sounds/button-error.mp3' },
      { name: 'magic', url: '/sounds/button-magic.mp3' }
    ];

    const loadPromises = soundFiles.map(({ name, url }) => 
      this.loadSound(name, url).catch(() => {
        // Create fallback synthetic sounds if files don't exist
        this.createSyntheticSound(name);
      })
    );

    await Promise.all(loadPromises);
  }

  createSyntheticSound(name) {
    if (!this.isInitialized || !this.audioContext) return;

    // Create synthetic sounds using Web Audio API
    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate different waveforms for different sound types
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      switch (name) {
        case 'hover':
          data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 5) * 0.3;
          break;
        case 'click':
          data[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 8) * 0.4;
          break;
        case 'success':
          data[i] = Math.sin(2 * Math.PI * (600 + t * 400) * t) * Math.exp(-t * 3) * 0.3;
          break;
        case 'error':
          data[i] = Math.sin(2 * Math.PI * (400 - t * 200) * t) * Math.exp(-t * 4) * 0.4;
          break;
        case 'magic':
          data[i] = (Math.sin(2 * Math.PI * 1000 * t) + Math.sin(2 * Math.PI * 1500 * t)) * Math.exp(-t * 2) * 0.2;
          break;
        default:
          data[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 5) * 0.3;
      }
    }

    this.sounds.set(name, { type: 'webaudio', buffer });
  }

  async playSound(name, volume = 1) {
    if (this.isMuted || !this.sounds.has(name)) return;

    await this.resumeAudioContext();

    const sound = this.sounds.get(name);
    const finalVolume = this.masterVolume * volume;

    try {
      if (sound.type === 'webaudio' && this.audioContext) {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = sound.buffer;
        gainNode.gain.value = finalVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
      } else if (sound.type === 'html5') {
        const audio = sound.audio.cloneNode();
        audio.volume = finalVolume;
        audio.play().catch(error => {
          console.warn('Failed to play HTML5 audio:', error);
        });
      }
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error);
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  isMutedState() {
    return this.isMuted;
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Initialize sounds when the module loads
audioManager.preloadSounds();

export default audioManager;
