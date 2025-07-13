import { useCallback, useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

/**
 * Custom hook for managing sound effects in React components
 * Provides easy-to-use interface for playing sounds with Final Fantasy flair
 */
export const useSound = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolumeState] = useState(audioManager.getMasterVolume());
  const [isMuted, setIsMutedState] = useState(audioManager.isMutedState());

  useEffect(() => {
    // Mark as loaded after a short delay to ensure sounds are preloaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const playSound = useCallback(async (soundName, customVolume = 1) => {
    if (!isLoaded) return;
    
    try {
      await audioManager.playSound(soundName, customVolume);
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error);
    }
  }, [isLoaded]);

  const setVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioManager.setMasterVolume(clampedVolume);
    setVolumeState(clampedVolume);
  }, []);

  const setMuted = useCallback((muted) => {
    audioManager.setMuted(muted);
    setIsMutedState(muted);
  }, []);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setMuted(newMutedState);
  }, [isMuted, setMuted]);

  // Predefined sound effects for common button interactions
  const buttonSounds = {
    hover: useCallback(() => playSound('hover', 0.6), [playSound]),
    click: useCallback(() => playSound('click', 0.8), [playSound]),
    success: useCallback(() => playSound('success', 0.7), [playSound]),
    error: useCallback(() => playSound('error', 0.8), [playSound]),
    magic: useCallback(() => playSound('magic', 0.5), [playSound]),
  };

  return {
    playSound,
    buttonSounds,
    isLoaded,
    volume,
    setVolume,
    isMuted,
    setMuted,
    toggleMute,
  };
};

/**
 * Hook specifically for button sound effects
 * Returns optimized handlers for button interactions
 */
export const useButtonSounds = (type = 'default') => {
  const { buttonSounds, isLoaded } = useSound();

  const getHoverSound = useCallback(() => {
    if (!isLoaded) return () => {};
    
    switch (type) {
      case 'primary':
      case 'add':
        return buttonSounds.hover;
      case 'success':
      case 'save':
        return buttonSounds.magic;
      case 'danger':
      case 'delete':
        return buttonSounds.hover;
      case 'secondary':
      case 'edit':
      case 'cancel':
      default:
        return buttonSounds.hover;
    }
  }, [buttonSounds, isLoaded, type]);

  const getClickSound = useCallback(() => {
    if (!isLoaded) return () => {};
    
    switch (type) {
      case 'primary':
      case 'add':
        return buttonSounds.click;
      case 'success':
      case 'save':
        return buttonSounds.success;
      case 'danger':
      case 'delete':
        return buttonSounds.error;
      case 'secondary':
      case 'edit':
      case 'cancel':
      default:
        return buttonSounds.click;
    }
  }, [buttonSounds, isLoaded, type]);

  return {
    onHover: getHoverSound(),
    onClick: getClickSound(),
    isLoaded,
  };
};

export default useSound;
