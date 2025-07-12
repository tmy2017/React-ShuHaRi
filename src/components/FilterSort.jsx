import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFilter, removeFilter, addSort, removeSort } from '../store';
import { 
  FILTER_OPERATORS, 
  SORT_DIRECTIONS, 
  getOperatorsForFieldType, 
  getOperatorDisplayName 
} from '../utils/dataUtils';
import './FilterSort.css';

const FilterSort = ({ table, view }) => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [showSorts, setShowSorts] = useState(false);
  const [newFilter, setNewFilter] = useState({
    fieldId: '',
    operator: '',
    value: ''
  });

  const handleAddFilter = () => {
    if (newFilter.fieldId && newFilter.operator) {
      dispatch(addFilter({
        tableId: table.id,
        viewId: view.id,
        filter: newFilter
      }));
      setNewFilter({ fieldId: '', operator: '', value: '' });
    }
  };

  const handleRemoveFilter = (filterId) => {
    dispatch(removeFilter({
      tableId: table.id,
      viewId: view.id,
      filterId
    }));
  };

  const handleToggleSort = (fieldId) => {
    const existingSort = view.sorts.find(s => s.fieldId === fieldId);
    
    if (existingSort) {
      if (existingSort.direction === SORT_DIRECTIONS.ASC) {
        // Change to DESC
        dispatch(addSort({
          tableId: table.id,
          viewId: view.id,
          sort: { fieldId, direction: SORT_DIRECTIONS.DESC }
        }));
      } else {
        // Remove sort
        dispatch(removeSort({
          tableId: table.id,
          viewId: view.id,
          fieldId
        }));
      }
    } else {
      // Add ASC sort
      dispatch(addSort({
        tableId: table.id,
        viewId: view.id,
        sort: { fieldId, direction: SORT_DIRECTIONS.ASC }
      }));
    }
  };

  const getSortIcon = (fieldId) => {
    const sort = view.sorts.find(s => s.fieldId === fieldId);
    if (!sort) return '↕️';
    return sort.direction === SORT_DIRECTIONS.ASC ? '↑' : '↓';
  };

  const getSortTitle = (fieldId) => {
    const sort = view.sorts.find(s => s.fieldId === fieldId);
    if (!sort) return 'Click to sort ascending';
    if (sort.direction === SORT_DIRECTIONS.ASC) return 'Click to sort descending';
    return 'Click to remove sort';
  };

  const getFieldById = (fieldId) => {
    return table.fields.find(f => f.id === fieldId);
  };

  const needsValue = (operator) => {
    return ![
      FILTER_OPERATORS.IS_EMPTY,
      FILTER_OPERATORS.IS_NOT_EMPTY,
      FILTER_OPERATORS.IS_CHECKED,
      FILTER_OPERATORS.IS_NOT_CHECKED
    ].includes(operator);
  };

  return (
    <div className="filter-sort-panel">
      <div className="filter-sort-header">
        <div className="filter-sort-buttons">
          <button
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filter {view.filters.length > 0 && `(${view.filters.length})`}
          </button>
          <button
            className={`sort-btn ${showSorts ? 'active' : ''}`}
            onClick={() => setShowSorts(!showSorts)}
          >
            📊 Sort {view.sorts.length > 0 && `(${view.sorts.length})`}
          </button>
        </div>
        
        {/* Quick sort buttons for each field */}
        <div className="quick-sort-buttons">
          {table.fields.map(field => (
            <button
              key={field.id}
              className={`quick-sort-btn ${view.sorts.find(s => s.fieldId === field.id) ? 'active' : ''}`}
              onClick={() => handleToggleSort(field.id)}
              title={getSortTitle(field.id)}
            >
              {field.name} {getSortIcon(field.id)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <h4>Filters</h4>
          
          {/* Existing Filters */}
          {view.filters.map(filter => {
            const field = getFieldById(filter.fieldId);
            return (
              <div key={filter.id} className="filter-item">
                <span className="filter-field">{field?.name}</span>
                <span className="filter-operator">
                  {getOperatorDisplayName(filter.operator)}
                </span>
                {needsValue(filter.operator) && (
                  <span className="filter-value">"{filter.value}"</span>
                )}
                <button
                  className="remove-filter-btn"
                  onClick={() => handleRemoveFilter(filter.id)}
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* Add New Filter */}
          <div className="add-filter">
            <select
              value={newFilter.fieldId}
              onChange={(e) => setNewFilter({ ...newFilter, fieldId: e.target.value, operator: '' })}
              className="filter-field-select"
            >
              <option value="">Select field...</option>
              {table.fields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>

            {newFilter.fieldId && (
              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
                className="filter-operator-select"
              >
                <option value="">Select operator...</option>
                {getOperatorsForFieldType(getFieldById(newFilter.fieldId)?.type).map(operator => (
                  <option key={operator} value={operator}>
                    {getOperatorDisplayName(operator)}
                  </option>
                ))}
              </select>
            )}

            {newFilter.operator && needsValue(newFilter.operator) && (
              <input
                type="text"
                value={newFilter.value}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                placeholder="Filter value..."
                className="filter-value-input"
              />
            )}

            <button
              onClick={handleAddFilter}
              disabled={!newFilter.fieldId || !newFilter.operator}
              className="add-filter-btn"
            >
              Add Filter
            </button>
          </div>
        </div>
      )}

      {/* Sorts Panel */}
      {showSorts && (
        <div className="sorts-panel">
          <h4>Sort Order</h4>
          
          {view.sorts.length === 0 ? (
            <p className="no-sorts">No sorting applied. Click field buttons above to sort.</p>
          ) : (
            <div className="sorts-list">
              {view.sorts.map((sort, index) => {
                const field = getFieldById(sort.fieldId);
                return (
                  <div key={sort.id} className="sort-item">
                    <span className="sort-index">{index + 1}.</span>
                    <span className="sort-field">{field?.name}</span>
                    <span className="sort-direction">
                      {sort.direction === SORT_DIRECTIONS.ASC ? 'Ascending' : 'Descending'}
                    </span>
                    <button
                      className="remove-sort-btn"
                      onClick={() => handleToggleSort(sort.fieldId)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSort;
