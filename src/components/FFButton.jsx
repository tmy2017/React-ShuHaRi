import React, { useState, useCallback } from 'react';
import { useButtonSounds } from '../hooks/useSound';
import '../styles/ffAnimations.css';

/**
 * Final Fantasy-style Button Component
 * Features enhanced animations, sound effects, and visual flair
 */
const FFButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'medium',
  disabled = false,
  className = '',
  pulse = false,
  sparkle = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { onHover, onClick: onClickSound } = useButtonSounds(variant);

  // Handle mouse events with sound effects
  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      onHover();
    }
  }, [disabled, onHover]);

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setIsPressed(true);
    }
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback((event) => {
    if (!disabled) {
      onClickSound();
      if (onClick) {
        onClick(event);
      }
    }
  }, [disabled, onClickSound, onClick]);

  // Build CSS classes
  const getButtonClasses = () => {
    const baseClasses = ['ff-button'];
    
    // Variant classes
    switch (variant) {
      case 'primary':
      case 'add':
        baseClasses.push('ff-button--primary');
        break;
      case 'success':
      case 'save':
        baseClasses.push('ff-button--success');
        break;
      case 'danger':
      case 'delete':
        baseClasses.push('ff-button--danger');
        break;
      case 'warning':
      case 'edit':
        baseClasses.push('ff-button--warning');
        break;
      case 'secondary':
      case 'cancel':
        baseClasses.push('ff-button--secondary');
        break;
      default:
        break;
    }

    // Size classes
    switch (size) {
      case 'small':
        baseClasses.push('ff-button--small');
        break;
      case 'large':
        baseClasses.push('ff-button--large');
        break;
      default:
        break;
    }

    // Effect classes
    if (pulse) {
      baseClasses.push('ff-button--pulse');
    }
    
    if (sparkle) {
      baseClasses.push('ff-button--sparkle');
    }

    // State classes
    if (isPressed) {
      baseClasses.push('ff-button--pressed');
    }

    // Custom classes
    if (className) {
      baseClasses.push(className);
    }

    return baseClasses.join(' ');
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      {children}
    </button>
  );
};

// Convenience components for specific button types
export const FFAddButton = (props) => (
  <FFButton variant="add" {...props} />
);

export const FFEditButton = (props) => (
  <FFButton variant="edit" {...props} />
);

export const FFDeleteButton = (props) => (
  <FFButton variant="delete" {...props} />
);

export const FFSaveButton = (props) => (
  <FFButton variant="save" sparkle {...props} />
);

export const FFCancelButton = (props) => (
  <FFButton variant="cancel" {...props} />
);

export default FFButton;
