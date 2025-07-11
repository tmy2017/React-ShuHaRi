import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Add with animation
  const handleAdd = () => {
    if (input.trim()) {
      const newId = Date.now();
      setItems([...items, { id: newId, text: input, status: 'entering' }]);
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
    setItems(items.map(item =>
      item.id === editId
        ? { ...item, text: editValue, status: 'updating' }
        : item
    ));
    setEditId(null);
    setEditValue('');
  };

  // Delete with animation
  const handleDelete = (id) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, status: 'exiting' }
        : item
    ));
  };

  // Handle animation transitions
  useEffect(() => {
    const timers = [];
    items.forEach(item => {
      if (item.status === 'entering' || item.status === 'updating') {
        timers.push(setTimeout(() => {
          setItems(items =>
            items.map(i =>
              i.id === item.id ? { ...i, status: 'idle' } : i
            )
          );
        }, 400));
      }
      if (item.status === 'exiting') {
        timers.push(setTimeout(() => {
          setItems(items => items.filter(i => i.id !== item.id));
        }, 400));
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [items]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Simple CRUD App</h1>
      <div className="card">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={handleAdd}>Add</button>
        <ul>
          {items.map(item => (
            <li
              key={item.id}
              className={
                item.status === 'entering'
                  ? 'item-enter'
                  : item.status === 'exiting'
                  ? 'item-exit'
                  : item.status === 'updating'
                  ? 'item-update'
                  : ''
              }
            >
              {editId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {item.text}
                  <button onClick={() => handleEdit(item.id, item.text)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
