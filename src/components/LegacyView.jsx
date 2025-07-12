import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Legacy component for backward compatibility
const LegacyView = () => {
  const dispatch = useDispatch();
  const { tables, activeTableId } = useSelector(state => state.tables);
  const activeTable = tables.find(t => t.id === activeTableId);
  
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Convert new data structure to legacy format for display
  const legacyItems = activeTable ? activeTable.records.map(record => {
    const firstField = activeTable.fields[0];
    return {
      id: record.id,
      text: record.data[firstField?.id] || '',
      status: record.status
    };
  }) : [];

  const handleAdd = () => {
    if (input.trim() && activeTable) {
      const firstField = activeTable.fields[0];
      if (firstField) {
        dispatch({
          type: 'tables/addRecord',
          payload: {
            tableId: activeTableId,
            record: {
              data: {
                [firstField.id]: input
              }
            }
          }
        });
        setInput('');
      }
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditValue(text);
  };

  const handleUpdate = () => {
    if (activeTable) {
      const firstField = activeTable.fields[0];
      if (firstField) {
        dispatch({
          type: 'tables/updateRecord',
          payload: {
            tableId: activeTableId,
            recordId: editId,
            data: {
              [firstField.id]: editValue
            }
          }
        });
      }
    }
    setEditId(null);
    setEditValue('');
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'tables/deleteRecord',
      payload: {
        tableId: activeTableId,
        recordId: id
      }
    });
  };

  // Handle animation transitions
  useEffect(() => {
    if (!activeTable) return;
    
    const timers = [];
    activeTable.records.forEach(record => {
      if (record.status === 'entering' || record.status === 'updating') {
        timers.push(setTimeout(() => {
          dispatch({
            type: 'tables/setRecordIdle',
            payload: {
              tableId: activeTableId,
              recordId: record.id
            }
          });
        }, 400));
      }
      if (record.status === 'exiting') {
        timers.push(setTimeout(() => {
          dispatch({
            type: 'tables/removeRecord',
            payload: {
              tableId: activeTableId,
              recordId: record.id
            }
          });
        }, 400));
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [activeTable?.records, dispatch, activeTableId]);

  return (
    <section className="card">
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new item"
          className="input"
        />
        <button className="btn btn-add" onClick={handleAdd}>Add</button>
      </div>
      <ul className="item-list">
        {legacyItems.map(item => (
          <li
            key={item.id}
            className={
              "item " +
              (item.status === 'entering'
                ? 'item-enter'
                : item.status === 'exiting'
                ? 'item-exit'
                : item.status === 'updating'
                ? 'item-update'
                : '')
            }
          >
            {editId === item.id ? (
              <div className="edit-row">
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="input"
                />
                <button className="btn btn-save" onClick={handleUpdate}>Save</button>
                <button className="btn btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="item-row">
                <span className="item-text">{item.text}</span>
                <button className="btn btn-edit" onClick={() => handleEdit(item.id, item.text)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LegacyView;
