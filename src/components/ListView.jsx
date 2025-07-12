import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateRecord, deleteRecord } from '../store';
import { FieldRenderer } from './FieldTypes';
import './ListView.css';

const ListView = ({ table, view, records }) => {
  const dispatch = useDispatch();
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (recordId, fieldId, currentValue) => {
    setEditingCell({ recordId, fieldId });
    setEditValue(currentValue || '');
  };

  const handleCellSave = () => {
    if (editingCell) {
      const { recordId, fieldId } = editingCell;
      const field = table.fields.find(f => f.id === fieldId);
      
      let processedValue = editValue;
      
      // Process value based on field type
      if (field.type === 'number') {
        processedValue = parseFloat(editValue) || 0;
      } else if (field.type === 'checkbox') {
        processedValue = Boolean(editValue);
      }
      
      dispatch(updateRecord({
        tableId: table.id,
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

  const handleDeleteRecord = (recordId) => {
    dispatch(deleteRecord({ tableId: table.id, recordId }));
  };

  const visibleFields = table.fields.filter(field => 
    !view.hiddenFields.includes(field.id)
  );

  const primaryField = visibleFields[0];
  const secondaryFields = visibleFields.slice(1);

  return (
    <div className="list-view">
      {records.length === 0 ? (
        <div className="empty-list">
          <p>No records to display</p>
        </div>
      ) : (
        <div className="list-items">
          {records.map((record, index) => (
            <div 
              key={record.id} 
              className={`list-item ${record.status ? 'item-' + record.status : ''}`}
            >
              <div className="list-item-header">
                <div className="list-item-number">
                  {index + 1}
                </div>
                <div className="list-item-primary">
                  {primaryField && (
                    <div 
                      className="primary-field-wrapper"
                      role="button"
                      tabIndex={0}
                      onClick={() => !editingCell && handleCellClick(record.id, primaryField.id, record.data[primaryField.id])}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !editingCell) {
                          e.preventDefault();
                          handleCellClick(record.id, primaryField.id, record.data[primaryField.id]);
                        }
                      }}
                    >
                      <FieldRenderer
                        field={primaryField}
                        value={editingCell?.recordId === record.id && editingCell?.fieldId === primaryField.id ? editValue : record.data[primaryField.id]}
                        onChange={setEditValue}
                        onSave={handleCellSave}
                        onCancel={handleCellCancel}
                        isEditing={editingCell?.recordId === record.id && editingCell?.fieldId === primaryField.id}
                      />
                    </div>
                  )}
                </div>
                <div className="list-item-actions">
                  <button
                    className="delete-record-btn"
                    onClick={() => handleDeleteRecord(record.id)}
                    title="Delete record"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {secondaryFields.length > 0 && (
                <div className="list-item-details">
                  {secondaryFields.map(field => (
                    <div key={field.id} className="detail-field">
                      <div className="detail-field-label">
                        {field.name}:
                      </div>
                      <div 
                        className="detail-field-value"
                        role="button"
                        tabIndex={0}
                        onClick={() => !editingCell && handleCellClick(record.id, field.id, record.data[field.id])}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !editingCell) {
                            e.preventDefault();
                            handleCellClick(record.id, field.id, record.data[field.id]);
                          }
                        }}
                      >
                        <FieldRenderer
                          field={field}
                          value={editingCell?.recordId === record.id && editingCell?.fieldId === field.id ? editValue : record.data[field.id]}
                          onChange={setEditValue}
                          onSave={handleCellSave}
                          onCancel={handleCellCancel}
                          isEditing={editingCell?.recordId === record.id && editingCell?.fieldId === field.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;
