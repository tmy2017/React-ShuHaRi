import { configureStore, createSlice } from '@reduxjs/toolkit';

// Field types supported by the system
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox'
};

// Default table structure
const createDefaultTable = () => ({
  id: 'default-table',
  name: 'My Table',
  fields: [
    {
      id: 'field-1',
      name: 'Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      options: null
    },
    {
      id: 'field-2',
      name: 'Status',
      type: FIELD_TYPES.SELECT,
      required: false,
      options: ['Todo', 'In Progress', 'Done']
    },
    {
      id: 'field-3',
      name: 'Priority',
      type: FIELD_TYPES.NUMBER,
      required: false,
      options: null
    }
  ],
  records: [
    {
      id: 'record-1',
      data: {
        'field-1': 'Sample Task',
        'field-2': 'Todo',
        'field-3': 1
      },
      status: 'idle'
    },
    {
      id: 'record-2',
      data: {
        'field-1': 'Another Task',
        'field-2': 'In Progress',
        'field-3': 2
      },
      status: 'idle'
    }
  ],
  views: [
    {
      id: 'view-1',
      name: 'All Records',
      type: 'grid',
      filters: [],
      sorts: [],
      hiddenFields: []
    }
  ],
  activeViewId: 'view-1'
});

// Tables slice for managing multiple tables
const tablesSlice = createSlice({
  name: 'tables',
  initialState: {
    tables: [createDefaultTable()],
    activeTableId: 'default-table'
  },
  reducers: {
    // Table management
    createTable: (state, action) => {
      const newTable = {
        id: action.payload.id || `table-${Date.now()}`,
        name: action.payload.name || 'New Table',
        fields: action.payload.fields || [
          {
            id: `field-${Date.now()}`,
            name: 'Name',
            type: FIELD_TYPES.TEXT,
            required: true,
            options: null
          }
        ],
        records: [],
        views: [
          {
            id: `view-${Date.now()}`,
            name: 'All Records',
            type: 'grid',
            filters: [],
            sorts: [],
            hiddenFields: []
          }
        ],
        activeViewId: `view-${Date.now()}`
      };
      state.tables.push(newTable);
    },

    setActiveTable: (state, action) => {
      state.activeTableId = action.payload;
    },

    // Field management
    addField: (state, action) => {
      const { tableId, field } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const newField = {
          id: field.id || `field-${Date.now()}`,
          name: field.name || 'New Field',
          type: field.type || FIELD_TYPES.TEXT,
          required: field.required || false,
          options: field.options || null
        };
        table.fields.push(newField);

        // Initialize field data for existing records
        table.records.forEach(record => {
          record.data[newField.id] = getDefaultValueForFieldType(newField.type);
        });
      }
    },

    updateField: (state, action) => {
      const { tableId, fieldId, updates } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const field = table.fields.find(f => f.id === fieldId);
        if (field) {
          Object.assign(field, updates);
        }
      }
    },

    deleteField: (state, action) => {
      const { tableId, fieldId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.fields = table.fields.filter(f => f.id !== fieldId);
        // Remove field data from all records
        table.records.forEach(record => {
          delete record.data[fieldId];
        });
      }
    },

    reorderFields: (state, action) => {
      const { tableId, fromIndex, toIndex } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const fields = [...table.fields];
        const [movedField] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, movedField);
        table.fields = fields;
      }
    },

    // Record management
    addRecord: (state, action) => {
      const { tableId, record } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const newRecord = {
          id: record.id || `record-${Date.now()}`,
          data: record.data || {},
          status: 'entering'
        };

        // Initialize empty fields
        table.fields.forEach(field => {
          if (!(field.id in newRecord.data)) {
            newRecord.data[field.id] = getDefaultValueForFieldType(field.type);
          }
        });

        table.records.push(newRecord);
      }
    },

    updateRecord: (state, action) => {
      const { tableId, recordId, data } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const record = table.records.find(r => r.id === recordId);
        if (record) {
          record.data = { ...record.data, ...data };
          record.status = 'updating';
        }
      }
    },

    deleteRecord: (state, action) => {
      const { tableId, recordId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const record = table.records.find(r => r.id === recordId);
        if (record) {
          record.status = 'exiting';
        }
      }
    },

    // Animation status management
    setRecordIdle: (state, action) => {
      const { tableId, recordId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const record = table.records.find(r => r.id === recordId);
        if (record) {
          record.status = 'idle';
        }
      }
    },

    removeRecord: (state, action) => {
      const { tableId, recordId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.records = table.records.filter(r => r.id !== recordId);
      }
    },

    // View management
    updateView: (state, action) => {
      const { tableId, viewId, updates } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const view = table.views.find(v => v.id === viewId);
        if (view) {
          Object.assign(view, updates);
        }
      }
    },

    addFilter: (state, action) => {
      const { tableId, viewId, filter } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const view = table.views.find(v => v.id === viewId);
        if (view) {
          view.filters.push({
            id: `filter-${Date.now()}`,
            fieldId: filter.fieldId,
            operator: filter.operator,
            value: filter.value
          });
        }
      }
    },

    removeFilter: (state, action) => {
      const { tableId, viewId, filterId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const view = table.views.find(v => v.id === viewId);
        if (view) {
          view.filters = view.filters.filter(f => f.id !== filterId);
        }
      }
    },

    addSort: (state, action) => {
      const { tableId, viewId, sort } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const view = table.views.find(v => v.id === viewId);
        if (view) {
          // Remove existing sort for this field
          view.sorts = view.sorts.filter(s => s.fieldId !== sort.fieldId);
          view.sorts.push({
            id: `sort-${Date.now()}`,
            fieldId: sort.fieldId,
            direction: sort.direction
          });
        }
      }
    },

    removeSort: (state, action) => {
      const { tableId, viewId, fieldId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const view = table.views.find(v => v.id === viewId);
        if (view) {
          view.sorts = view.sorts.filter(s => s.fieldId !== fieldId);
        }
      }
    },

    // View management
    createView: (state, action) => {
      const { tableId, view } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const newView = {
          id: view.id || `view-${Date.now()}`,
          name: view.name || 'New View',
          type: view.type || 'grid',
          filters: view.filters || [],
          sorts: view.sorts || [],
          hiddenFields: view.hiddenFields || []
        };
        table.views.push(newView);
      }
    },

    deleteView: (state, action) => {
      const { tableId, viewId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table && table.views.length > 1) { // Keep at least one view
        table.views = table.views.filter(v => v.id !== viewId);
        // If we deleted the active view, switch to the first remaining view
        if (table.activeViewId === viewId) {
          table.activeViewId = table.views[0].id;
        }
      }
    },

    setActiveView: (state, action) => {
      const { tableId, viewId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.activeViewId = viewId;
      }
    },

    duplicateView: (state, action) => {
      const { tableId, viewId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        const originalView = table.views.find(v => v.id === viewId);
        if (originalView) {
          const duplicatedView = {
            ...originalView,
            id: `view-${Date.now()}`,
            name: `${originalView.name} (Copy)`,
            filters: [...originalView.filters],
            sorts: [...originalView.sorts],
            hiddenFields: [...originalView.hiddenFields]
          };
          table.views.push(duplicatedView);
        }
      }
    }
  }
});

// Helper function to get default values for field types
function getDefaultValueForFieldType(fieldType) {
  switch (fieldType) {
    case FIELD_TYPES.TEXT:
      return '';
    case FIELD_TYPES.NUMBER:
      return 0;
    case FIELD_TYPES.DATE:
      return '';
    case FIELD_TYPES.SELECT:
      return '';
    case FIELD_TYPES.CHECKBOX:
      return false;
    default:
      return '';
  }
}

export const {
  createTable,
  setActiveTable,
  addField,
  updateField,
  deleteField,
  reorderFields,
  addRecord,
  updateRecord,
  deleteRecord,
  setRecordIdle,
  removeRecord,
  updateView,
  addFilter,
  removeFilter,
  addSort,
  removeSort,
  createView,
  deleteView,
  setActiveView,
  duplicateView
} = tablesSlice.actions;

const store = configureStore({
  reducer: {
    tables: tablesSlice.reducer
  }
});

export default store;
