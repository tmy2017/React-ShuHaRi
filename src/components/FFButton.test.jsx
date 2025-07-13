import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FFButton, { FFAddButton, FFSaveButton, FFDeleteButton } from './FFButton';

// Mock the sound hook
vi.mock('../hooks/useSound', () => ({
  useButtonSounds: () => ({
    onHover: vi.fn(),
    onClick: vi.fn(),
    isLoaded: true,
  }),
}));

describe('FFButton Component', () => {
  it('renders with default props', () => {
    render(<FFButton>Test Button</FFButton>);
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ff-button');
  });

  it('applies variant classes correctly', () => {
    render(<FFButton variant="primary">Primary Button</FFButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--primary');
  });

  it('applies size classes correctly', () => {
    render(<FFButton size="large">Large Button</FFButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--large');
  });

  it('applies effect classes correctly', () => {
    render(<FFButton pulse sparkle>Effect Button</FFButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--pulse');
    expect(button).toHaveClass('ff-button--sparkle');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<FFButton onClick={handleClick}>Click Me</FFButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    const handleClick = vi.fn();
    render(<FFButton disabled onClick={handleClick}>Disabled Button</FFButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles mouse events for pressed state', () => {
    render(<FFButton>Hover Me</FFButton>);
    const button = screen.getByRole('button');
    
    fireEvent.mouseDown(button);
    expect(button).toHaveClass('ff-button--pressed');
    
    fireEvent.mouseUp(button);
    expect(button).not.toHaveClass('ff-button--pressed');
  });
});

describe('Convenience Components', () => {
  it('FFAddButton has correct variant', () => {
    render(<FFAddButton>Add</FFAddButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--primary');
  });

  it('FFSaveButton has sparkle effect', () => {
    render(<FFSaveButton>Save</FFSaveButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--success');
    expect(button).toHaveClass('ff-button--sparkle');
  });

  it('FFDeleteButton has correct variant', () => {
    render(<FFDeleteButton>Delete</FFDeleteButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-button--danger');
  });
});
