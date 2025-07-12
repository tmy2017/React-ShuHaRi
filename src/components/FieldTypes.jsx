import { useState } from 'react';
import { FIELD_TYPES } from '../store';

// Text Field Component
export const TextField = ({ value, onChange, onSave, onCancel, isEditing }) => {
  if (isEditing) {
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave();
          if (e.key === 'Escape') onCancel();
        }}
        className="field-input"
        autoFocus
      />
    );
  }
  
  return (
    <div className="field-display text-field">
      {value || ''}
    </div>
  );
};

// Number Field Component
export const NumberField = ({ value, onChange, onSave, onCancel, isEditing }) => {
  if (isEditing) {
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave();
          if (e.key === 'Escape') onCancel();
        }}
        className="field-input"
        autoFocus
      />
    );
  }
  
  return (
    <div className="field-display number-field">
      {value !== null && value !== undefined ? value : ''}
    </div>
  );
};

// Date Field Component
export const DateField = ({ value, onChange, onSave, onCancel, isEditing }) => {
  if (isEditing) {
    return (
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave();
          if (e.key === 'Escape') onCancel();
        }}
        className="field-input"
        autoFocus
      />
    );
  }
  
  return (
    <div className="field-display date-field">
      {value ? new Date(value).toLocaleDateString() : ''}
    </div>
  );
};

// Select Field Component
export const SelectField = ({ value, onChange, onSave, onCancel, isEditing, options = [] }) => {
  if (isEditing) {
    return (
      <select
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value);
          onSave(); // Auto-save on selection
        }}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
        }}
        className="field-input"
        autoFocus
      >
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }
  
  return (
    <div className={`field-display select-field ${value ? 'has-value' : ''}`}>
      {value ? (
        <span className="select-tag">{value}</span>
      ) : (
        <span className="select-placeholder">Select...</span>
      )}
    </div>
  );
};

// Checkbox Field Component
export const CheckboxField = ({ value, onChange, onSave, onCancel, isEditing }) => {
  const handleToggle = () => {
    const newValue = !Boolean(value);
    onChange(newValue);
    onSave();
  };

  return (
    <div className="field-display checkbox-field">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={handleToggle}
          className="checkbox-input"
        />
        <span className="checkbox-custom"></span>
      </label>
    </div>
  );
};

// Field Type Selector Component
export const FieldTypeSelector = ({ value, onChange, disabled = false }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="field-type-selector"
    >
      <option value={FIELD_TYPES.TEXT}>Text</option>
      <option value={FIELD_TYPES.NUMBER}>Number</option>
      <option value={FIELD_TYPES.DATE}>Date</option>
      <option value={FIELD_TYPES.SELECT}>Select</option>
      <option value={FIELD_TYPES.CHECKBOX}>Checkbox</option>
    </select>
  );
};

// Options Editor for Select Fields
export const SelectOptionsEditor = ({ options = [], onChange }) => {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      onChange([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove) => {
    onChange(options.filter(option => option !== optionToRemove));
  };

  return (
    <div className="select-options-editor">
      <div className="options-list">
        {options.map(option => (
          <div key={option} className="option-item">
            <span>{option}</span>
            <button
              type="button"
              onClick={() => removeOption(option)}
              className="remove-option-btn"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="add-option">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addOption();
            }
          }}
          placeholder="Add option..."
          className="add-option-input"
        />
        <button
          type="button"
          onClick={addOption}
          className="add-option-btn"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// Universal Field Renderer
export const FieldRenderer = ({ field, value, onChange, onSave, onCancel, isEditing }) => {
  const commonProps = {
    value,
    onChange,
    onSave,
    onCancel,
    isEditing
  };

  switch (field.type) {
    case FIELD_TYPES.TEXT:
      return <TextField {...commonProps} />;
    case FIELD_TYPES.NUMBER:
      return <NumberField {...commonProps} />;
    case FIELD_TYPES.DATE:
      return <DateField {...commonProps} />;
    case FIELD_TYPES.SELECT:
      return <SelectField {...commonProps} options={field.options} />;
    case FIELD_TYPES.CHECKBOX:
      return <CheckboxField {...commonProps} />;
    default:
      return <TextField {...commonProps} />;
  }
};
