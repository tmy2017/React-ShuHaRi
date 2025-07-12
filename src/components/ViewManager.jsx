import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createView, 
  deleteView, 
  setActiveView, 
  duplicateView, 
  updateView 
} from '../store';
import './ViewManager.css';

const ViewManager = ({ table }) => {
  const dispatch = useDispatch();
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [editingView, setEditingView] = useState(null);
  const [newViewName, setNewViewName] = useState('');
  const [showCreateView, setShowCreateView] = useState(false);

  const activeView = table.views.find(v => v.id === table.activeViewId);

  const handleViewSwitch = (viewId) => {
    dispatch(setActiveView({ tableId: table.id, viewId }));
    setShowViewMenu(false);
  };

  const handleCreateView = () => {
    if (newViewName.trim()) {
      dispatch(createView({
        tableId: table.id,
        view: {
          name: newViewName,
          type: 'grid'
        }
      }));
      setNewViewName('');
      setShowCreateView(false);
    }
  };

  const handleDeleteView = (viewId) => {
    if (table.views.length > 1) {
      dispatch(deleteView({ tableId: table.id, viewId }));
    }
  };

  const handleDuplicateView = (viewId) => {
    dispatch(duplicateView({ tableId: table.id, viewId }));
    setShowViewMenu(false);
  };

  const handleRenameView = (viewId, newName) => {
    if (newName.trim()) {
      dispatch(updateView({
        tableId: table.id,
        viewId,
        updates: { name: newName }
      }));
    }
    setEditingView(null);
  };

  const getViewIcon = (viewType) => {
    switch (viewType) {
      case 'grid':
        return '⊞';
      case 'list':
        return '☰';
      default:
        return '⊞';
    }
  };

  const getViewStats = (view) => {
    const filterCount = view.filters.length;
    const sortCount = view.sorts.length;
    const stats = [];
    
    if (filterCount > 0) stats.push(`${filterCount} filter${filterCount > 1 ? 's' : ''}`);
    if (sortCount > 0) stats.push(`${sortCount} sort${sortCount > 1 ? 's' : ''}`);
    
    return stats.length > 0 ? stats.join(', ') : 'No filters or sorts';
  };

  return (
    <div className="view-manager">
      <div className="current-view">
        <button
          className="view-selector"
          onClick={() => setShowViewMenu(!showViewMenu)}
        >
          <span className="view-icon">{getViewIcon(activeView?.type)}</span>
          <span className="view-name">{activeView?.name}</span>
          <span className="view-dropdown-arrow">▼</span>
        </button>
        
        {showViewMenu && (
          <div className="view-menu">
            <div className="view-menu-header">
              <h4>Views</h4>
              <button
                className="close-menu-btn"
                onClick={() => setShowViewMenu(false)}
              >
                ×
              </button>
            </div>
            
            <div className="view-list">
              {table.views.map(view => (
                <div
                  key={view.id}
                  className={`view-item ${view.id === activeView?.id ? 'active' : ''}`}
                >
                  {editingView === view.id ? (
                    <div className="view-edit">
                      <input
                        type="text"
                        value={view.name}
                        onChange={(e) => {
                          dispatch(updateView({
                            tableId: table.id,
                            viewId: view.id,
                            updates: { name: e.target.value }
                          }));
                        }}
                        onBlur={() => setEditingView(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingView(null);
                          }
                          if (e.key === 'Escape') {
                            setEditingView(null);
                          }
                        }}
                        className="view-name-input"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className="view-info"
                        onClick={() => handleViewSwitch(view.id)}
                      >
                        <div className="view-header">
                          <span className="view-icon">{getViewIcon(view.type)}</span>
                          <span className="view-name">{view.name}</span>
                          {view.id === activeView?.id && (
                            <span className="active-indicator">●</span>
                          )}
                        </div>
                        <div className="view-stats">
                          {getViewStats(view)}
                        </div>
                      </div>
                      
                      <div className="view-actions">
                        <button
                          className="view-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingView(view.id);
                          }}
                          title="Rename view"
                        >
                          ✏️
                        </button>
                        <button
                          className="view-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateView(view.id);
                          }}
                          title="Duplicate view"
                        >
                          📋
                        </button>
                        {table.views.length > 1 && (
                          <button
                            className="view-action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteView(view.id);
                            }}
                            title="Delete view"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="view-menu-footer">
              {showCreateView ? (
                <div className="create-view-form">
                  <input
                    type="text"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateView();
                      if (e.key === 'Escape') {
                        setShowCreateView(false);
                        setNewViewName('');
                      }
                    }}
                    placeholder="View name..."
                    className="new-view-input"
                    autoFocus
                  />
                  <div className="create-view-actions">
                    <button
                      onClick={handleCreateView}
                      className="create-view-btn"
                      disabled={!newViewName.trim()}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateView(false);
                        setNewViewName('');
                      }}
                      className="cancel-view-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="add-view-btn"
                  onClick={() => setShowCreateView(true)}
                >
                  + Add View
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewManager;
