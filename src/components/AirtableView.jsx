import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setRecordIdle,
  removeRecord,
  addField,
  updateField,
  deleteField,
  reorderFields,
  FIELD_TYPES
} from '../store';
import { FieldRenderer, FieldTypeSelector, SelectOptionsEditor } from './FieldTypes';
import DragDropColumn from './DragDropColumn';
import FilterSort from './FilterSort';
import ViewManager from './ViewManager';
import ListView from './ListView';
import { getViewRecords } from '../utils/dataUtils';
import './AirtableView.css';
import './FieldTypes.css';

const AirtableView = () => {
  const dispatch = useDispatch();
  const { tables, activeTableId } = useSelector(state => state.tables);
  const activeTable = tables.find(t => t.id === activeTableId);
  const activeView = activeTable?.views.find(v => v.id === activeTable.activeViewId);

  // Get filtered and sorted records
  const displayRecords = activeTable && activeView
    ? getViewRecords(activeTable.records, activeView, activeTable.fields)
    : [];
  
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState(FIELD_TYPES.TEXT);
  const [editingField, setEditingField] = useState(null);
  const [showFieldOptions, setShowFieldOptions] = useState(null);

  // Handle animation transitions
  useEffect(() => {
    if (!activeTable) return;

    const timers = [];
    activeTable.records.forEach(record => {
      if (record.status === 'entering' || record.status === 'updating') {
        timers.push(setTimeout(() => {
          dispatch(setRecordIdle({ tableId: activeTableId, recordId: record.id }));
        }, 400));
      }
      if (record.status === 'exiting') {
        timers.push(setTimeout(() => {
          dispatch(removeRecord({ tableId: activeTableId, recordId: record.id }));
        }, 400));
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [activeTable?.records, dispatch, activeTableId]);

  const handleCellClick = (recordId, fieldId, currentValue) => {
    setEditingCell({ recordId, fieldId });
    setEditValue(currentValue || '');
  };

  const handleCellSave = () => {
    if (editingCell) {
      const { recordId, fieldId } = editingCell;
      const field = activeTable.fields.find(f => f.id === fieldId);
      
      let processedValue = editValue;
      
      // Process value based on field type
      if (field.type === FIELD_TYPES.NUMBER) {
        processedValue = parseFloat(editValue) || 0;
      } else if (field.type === FIELD_TYPES.CHECKBOX) {
        processedValue = Boolean(editValue);
      }
      
      dispatch(updateRecord({
        tableId: activeTableId,
        recordId,
        data: { [fieldId]: processedValue }
      }));
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddRecord = () => {
    dispatch(addRecord({
      tableId: activeTableId,
      record: {
        data: {}
      }
    }));
  };

  const handleDeleteRecord = (recordId) => {
    dispatch(deleteRecord({ tableId: activeTableId, recordId }));
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      dispatch(addField({
        tableId: activeTableId,
        field: {
          name: newFieldName,
          type: newFieldType
        }
      }));
      setNewFieldName('');
      setNewFieldType(FIELD_TYPES.TEXT);
      setShowAddField(false);
    }
  };

  const handleDeleteField = (fieldId) => {
    if (activeTable.fields.length > 1) { // Keep at least one field
      dispatch(deleteField({ tableId: activeTableId, fieldId }));
    }
  };

  const handleFieldEdit = (fieldId) => {
    setEditingField(fieldId);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    dispatch(updateField({ tableId: activeTableId, fieldId, updates }));
    setEditingField(null);
    setShowFieldOptions(null);
  };

  const handleFieldOptionsUpdate = (fieldId, options) => {
    dispatch(updateField({
      tableId: activeTableId,
      fieldId,
      updates: { options }
    }));
  };

  const handleFieldReorder = (fromIndex, toIndex) => {
    dispatch(reorderFields({
      tableId: activeTableId,
      fromIndex,
      toIndex
    }));
  };

  const renderCellContent = (record, field) => {
    const value = record.data[field.id];
    const isEditing = editingCell?.recordId === record.id && editingCell?.fieldId === field.id;

    return (
      <div
        className="cell-wrapper"
        role="button"
        tabIndex={0}
        onClick={() => !isEditing && handleCellClick(record.id, field.id, value)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isEditing) {
            e.preventDefault();
            handleCellClick(record.id, field.id, value);
          }
        }}
      >
        <FieldRenderer
          field={field}
          value={isEditing ? editValue : value}
          onChange={setEditValue}
          onSave={handleCellSave}
          onCancel={handleCellCancel}
          isEditing={isEditing}
        />
      </div>
    );
  };

  const renderViewContent = () => {
    if (!activeView) return null;

    switch (activeView.type) {
      case 'list':
        return (
          <ListView
            table={activeTable}
            view={activeView}
            records={displayRecords}
          />
        );
      case 'grid':
      default:
        return renderGridView();
    }
  };

  const renderGridView = () => (
    <div className="table-container">
      <table className="airtable-grid">
        <thead>
          <tr>
            <th className="row-number-header">#</th>
            {activeTable.fields.map((field, fieldIndex) => (
              <DragDropColumn
                key={field.id}
                index={fieldIndex}
                onReorder={handleFieldReorder}
                className="field-header"
              >
                {editingField === field.id ? (
                  <div className="field-editor">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleFieldUpdate(field.id, { name: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingField(null);
                        if (e.key === 'Escape') setEditingField(null);
                      }}
                      className="field-name-input"
                      autoFocus
                    />
                    <FieldTypeSelector
                      value={field.type}
                      onChange={(newType) => handleFieldUpdate(field.id, { type: newType })}
                    />
                    {field.type === FIELD_TYPES.SELECT && (
                      <button
                        onClick={() => setShowFieldOptions(field.id)}
                        className="options-btn"
                      >
                        Options
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="field-header-content">
                    <button
                      className="field-name-btn"
                      onClick={() => handleFieldEdit(field.id)}
                      title="Click to edit field name"
                    >
                      {field.name}
                    </button>
                    <span className="field-type">{field.type}</span>
                    {field.type === FIELD_TYPES.SELECT && field.options && (
                      <span className="field-options-count">
                        ({field.options.length} options)
                      </span>
                    )}
                    <button
                      className="field-delete-btn"
                      onClick={() => handleDeleteField(field.id)}
                      title="Delete field"
                    >
                      ×
                    </button>
                  </div>
                )}
                {showFieldOptions === field.id && field.type === FIELD_TYPES.SELECT && (
                  <div className="field-options-editor">
                    <SelectOptionsEditor
                      options={field.options || []}
                      onChange={(options) => handleFieldOptionsUpdate(field.id, options)}
                    />
                    <button
                      onClick={() => setShowFieldOptions(null)}
                      className="close-options-btn"
                    >
                      Close
                    </button>
                  </div>
                )}
              </DragDropColumn>
            ))}
            <th className="add-field-header">
              {showAddField ? (
                <div className="add-field-form">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddField();
                      if (e.key === 'Escape') setShowAddField(false);
                    }}
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                  >
                    {Object.values(FIELD_TYPES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button onClick={handleAddField}>Add</button>
                  <button onClick={() => setShowAddField(false)}>Cancel</button>
                </div>
              ) : (
                <button
                  className="add-field-btn"
                  onClick={() => setShowAddField(true)}
                >
                  + Add Field
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayRecords.map((record, index) => (
            <tr
              key={record.id}
              className={`table-row ${record.status ? 'row-' + record.status : ''}`}
            >
              <td className="row-number">
                <span>{index + 1}</span>
                <button
                  className="row-delete-btn"
                  onClick={() => handleDeleteRecord(record.id)}
                  title="Delete record"
                >
                  ×
                </button>
              </td>
              {activeTable.fields.map(field => (
                <td key={field.id} className="table-cell">
                  {renderCellContent(record, field)}
                </td>
              ))}
              <td className="empty-cell"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!activeTable) {
    return <div className="airtable-view">No table selected</div>;
  }

  return (
    <div className="airtable-view">
      <div className="table-header">
        <div className="table-title-section">
          <h2>{activeTable.name}</h2>
          <div className="table-meta">
            <ViewManager table={activeTable} />
            <span className="record-count">
              {displayRecords.length} of {activeTable.records.length} records
            </span>
          </div>
        </div>
        <div className="table-actions">
          <button className="btn btn-primary" onClick={handleAddRecord}>
            + Add Record
          </button>
        </div>
      </div>

      {activeView && (
        <FilterSort table={activeTable} view={activeView} />
      )}

      {renderViewContent()}

    </div>
  );
};

export default AirtableView;
