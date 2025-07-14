import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkdownField } from './FieldTypes';

describe('MarkdownField', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    isEditing: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('should render empty state when value is empty', () => {
      render(<MarkdownField {...defaultProps} value="" />);

      const displayElement = screen.getByTestId('markdown-display');
      expect(displayElement).toBeInTheDocument();
      expect(screen.getByText('Click to add markdown content...')).toBeInTheDocument();
    });

    it('should render plain text as markdown', () => {
      render(<MarkdownField {...defaultProps} value="Hello World" />);
      
      const displayElement = screen.getByTestId('markdown-display');
      expect(displayElement).toBeInTheDocument();
      expect(displayElement).toHaveTextContent('Hello World');
    });

    it('should render markdown formatting correctly', () => {
      const markdownText = '# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2';
      render(<MarkdownField {...defaultProps} value={markdownText} />);
      
      const displayElement = screen.getByTestId('markdown-display');
      expect(displayElement).toBeInTheDocument();
      
      // Check for heading
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
      
      // Check for bold text
      expect(screen.getByText('Bold text')).toHaveStyle('font-weight: bold');
      
      // Check for italic text
      expect(screen.getByText('italic text')).toHaveStyle('font-style: italic');
      
      // Check for list items
      expect(screen.getByText('List item 1')).toBeInTheDocument();
      expect(screen.getByText('List item 2')).toBeInTheDocument();
    });

    it('should handle code blocks', () => {
      const markdownText = '```javascript\nconst hello = "world";\n```';
      render(<MarkdownField {...defaultProps} value={markdownText} />);
      
      const codeElement = screen.getByText('const hello = "world";');
      expect(codeElement).toBeInTheDocument();
    });

    it('should handle links', () => {
      const markdownText = '[Google](https://google.com)';
      render(<MarkdownField {...defaultProps} value={markdownText} />);
      
      const linkElement = screen.getByRole('link', { name: 'Google' });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', 'https://google.com');
    });
  });

  describe('Edit Mode', () => {
    it('should render textarea when in editing mode', () => {
      render(<MarkdownField {...defaultProps} isEditing={true} value="Test content" />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('Test content');
    });

    it('should call onChange when textarea value changes', () => {
      const onChange = vi.fn();
      render(<MarkdownField {...defaultProps} isEditing={true} onChange={onChange} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      fireEvent.change(textarea, { target: { value: 'New content' } });
      
      expect(onChange).toHaveBeenCalledWith('New content');
    });

    it('should call onSave when textarea loses focus', () => {
      const onSave = vi.fn();
      render(<MarkdownField {...defaultProps} isEditing={true} onSave={onSave} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      fireEvent.blur(textarea);
      
      expect(onSave).toHaveBeenCalled();
    });

    it('should call onSave when Ctrl+Enter is pressed', () => {
      const onSave = vi.fn();
      render(<MarkdownField {...defaultProps} isEditing={true} onSave={onSave} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
      
      expect(onSave).toHaveBeenCalled();
    });

    it('should call onCancel when Escape is pressed', () => {
      const onCancel = vi.fn();
      render(<MarkdownField {...defaultProps} isEditing={true} onCancel={onCancel} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      fireEvent.keyDown(textarea, { key: 'Escape' });
      
      expect(onCancel).toHaveBeenCalled();
    });

    it('should auto-focus textarea when entering edit mode', () => {
      render(<MarkdownField {...defaultProps} isEditing={true} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      expect(textarea).toHaveFocus();
    });

    it('should handle empty value in edit mode', () => {
      render(<MarkdownField {...defaultProps} isEditing={true} value="" />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      expect(textarea).toHaveValue('');
    });

    it('should handle null/undefined values gracefully', () => {
      render(<MarkdownField {...defaultProps} isEditing={true} value={null} />);
      
      const textarea = screen.getByTestId('markdown-textarea');
      expect(textarea).toHaveValue('');
    });
  });

  describe('Mode Switching', () => {
    it('should switch from display to edit mode', () => {
      const { rerender } = render(<MarkdownField {...defaultProps} value="Test content" />);
      
      expect(screen.getByTestId('markdown-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markdown-textarea')).not.toBeInTheDocument();
      
      rerender(<MarkdownField {...defaultProps} value="Test content" isEditing={true} />);
      
      expect(screen.queryByTestId('markdown-display')).not.toBeInTheDocument();
      expect(screen.getByTestId('markdown-textarea')).toBeInTheDocument();
    });

    it('should preserve content when switching modes', () => {
      const content = '# Test\n\nSome **bold** text';
      const { rerender } = render(<MarkdownField {...defaultProps} value={content} />);
      
      // Check display mode shows rendered content
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test');
      
      // Switch to edit mode
      rerender(<MarkdownField {...defaultProps} value={content} isEditing={true} />);
      
      // Check edit mode shows raw markdown
      const textarea = screen.getByTestId('markdown-textarea');
      expect(textarea).toHaveValue(content);
    });
  });
});
