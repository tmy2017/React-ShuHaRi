import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addItem, updateItem, deleteItem, setIdle, removeItem } from './store'
import { FFAddButton, FFEditButton, FFDeleteButton, FFSaveButton, FFCancelButton } from './components/FFButton'
import ButtonDemo from './components/ButtonDemo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const items = useSelector(state => state.items);
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Add with animation
  const handleAdd = () => {
    if (input.trim()) {
      const newId = Date.now();
      dispatch(addItem({ id: newId, text: input }));
      setInput('');
    }
  };

  // Edit
  const handleEdit = (id, text) => {
    setEditId(id);
    setEditValue(text);
  };

  // Update with animation
  const handleUpdate = () => {
    dispatch(updateItem({ id: editId, text: editValue }));
    setEditId(null);
    setEditValue('');
  };

  // Delete with animation
  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  // Handle animation transitions
  useEffect(() => {
    const timers = [];
    items.forEach(item => {
      if (item.status === 'entering' || item.status === 'updating') {
        timers.push(setTimeout(() => {
          dispatch(setIdle(item.id));
        }, 400));
      }
      if (item.status === 'exiting') {
        timers.push(setTimeout(() => {
          dispatch(removeItem(item.id));
        }, 400));
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [items, dispatch]);

  return (
    <main className="app-container">
      {/* ...existing code... */}
      <header className="app-header">
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="app-title">Simple CRUD App</h1>
      </header>

      {/* Final Fantasy Button Demo */}
      <ButtonDemo />
      <section className="card">
        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add new item"
            className="input"
          />
          <FFAddButton onClick={handleAdd}>Add</FFAddButton>
        </div>
        <ul className="item-list">
          {items.map(item => (
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
                  <FFSaveButton onClick={handleUpdate}>Save</FFSaveButton>
                  <FFCancelButton onClick={() => setEditId(null)}>Cancel</FFCancelButton>
                </div>
              ) : (
                <div className="item-row">
                  <span className="item-text">{item.text}</span>
                  <FFEditButton onClick={() => handleEdit(item.id, item.text)}>Edit</FFEditButton>
                  <FFDeleteButton onClick={() => handleDelete(item.id)}>Delete</FFDeleteButton>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <footer>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </footer>
    </main>
  )
}

export default App
