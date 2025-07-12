import { useState } from 'react';
import './DragDropColumn.css';

const DragDropColumn = ({ 
  children, 
  index, 
  onReorder, 
  isDraggable = true,
  className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e) => {
    if (!isDraggable) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDragOverIndex(null);
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    const dropIndex = e.clientX < midpoint ? index : index + 1;
    
    setDragOverIndex(dropIndex);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the element entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = dragOverIndex !== null ? dragOverIndex : index;
    
    if (fromIndex !== toIndex && fromIndex !== toIndex - 1) {
      // Adjust toIndex if dragging from left to right
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      onReorder(fromIndex, adjustedToIndex);
    }
    
    setDragOverIndex(null);
  };

  return (
    <th
      className={`
        drag-drop-column 
        ${className} 
        ${isDragging ? 'dragging' : ''} 
        ${dragOverIndex === index ? 'drag-over-left' : ''} 
        ${dragOverIndex === index + 1 ? 'drag-over-right' : ''}
      `.trim()}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDraggable && (
        <div className="drag-handle" title="Drag to reorder">
          ⋮⋮
        </div>
      )}
      {children}
    </th>
  );
};

export default DragDropColumn;
