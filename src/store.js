import { configureStore, createSlice } from '@reduxjs/toolkit';

const itemsSlice = createSlice({
  name: 'items',
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      state.push({ id: action.payload.id, text: action.payload.text, status: 'entering' });
    },
    updateItem: (state, action) => {
      const item = state.find(i => i.id === action.payload.id);
      if (item) {
        item.text = action.payload.text;
        item.status = 'updating';
      }
    },
    deleteItem: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item) {
        item.status = 'exiting';
      }
    },
    setIdle: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item) {
        item.status = 'idle';
      }
    },
    removeItem: (state, action) => {
      return state.filter(i => i.id !== action.payload);
    }
  }
});

export const {
  addItem,
  updateItem,
  deleteItem,
  setIdle,
  removeItem
} = itemsSlice.actions;

const store = configureStore({
  reducer: {
    items: itemsSlice.reducer
  }
});

export default store;
