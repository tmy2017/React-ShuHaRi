import '@testing-library/jest-dom';

// Mock Web Audio API for tests
global.AudioContext = class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.sampleRate = 44100;
  }
  
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(1024)
    };
  }
  
  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      start: () => {}
    };
  }
  
  createGain() {
    return {
      gain: { value: 1 },
      connect: () => {}
    };
  }
  
  get destination() {
    return {};
  }
  
  decodeAudioData() {
    return Promise.resolve(this.createBuffer());
  }
  
  resume() {
    return Promise.resolve();
  }
};

global.webkitAudioContext = global.AudioContext;

// Mock fetch for audio loading
global.fetch = vi.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
  })
);
