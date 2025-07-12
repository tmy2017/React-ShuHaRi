import { configureStore, createSlice } from '@reduxjs/toolkit';

// Sample property data
const sampleProperties = [
  {
    id: 1,
    title: "Cozy Downtown Apartment",
    description: "Beautiful 2-bedroom apartment in the heart of the city with modern amenities and stunning views.",
    price: 120,
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "Parking"],
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    rating: 4.8,
    reviews: 127,
    host: "Sarah Johnson",
    status: 'idle'
  },
  {
    id: 2,
    title: "Luxury Beach House",
    description: "Stunning oceanfront property with private beach access and panoramic sea views.",
    price: 350,
    location: "Malibu, CA",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Pool", "Beach Access", "Parking"],
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    rating: 4.9,
    reviews: 89,
    host: "Michael Chen",
    status: 'idle'
  },
  {
    id: 3,
    title: "Mountain Cabin Retreat",
    description: "Peaceful cabin surrounded by nature, perfect for a relaxing getaway.",
    price: 85,
    location: "Aspen, CO",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Fireplace", "Kitchen", "Hiking Trails"],
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    rating: 4.7,
    reviews: 203,
    host: "Emma Wilson",
    status: 'idle'
  }
];

// Properties slice
const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    list: sampleProperties,
    searchQuery: '',
    filters: {
      minPrice: 0,
      maxPrice: 1000,
      guests: 1,
      amenities: []
    },
    selectedProperty: null
  },
  reducers: {
    addProperty: (state, action) => {
      state.list.push({ ...action.payload, status: 'entering' });
    },
    updateProperty: (state, action) => {
      const property = state.list.find(p => p.id === action.payload.id);
      if (property) {
        Object.assign(property, action.payload);
        property.status = 'updating';
      }
    },
    deleteProperty: (state, action) => {
      const property = state.list.find(p => p.id === action.payload);
      if (property) {
        property.status = 'exiting';
      }
    },
    removeProperty: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    setPropertyIdle: (state, action) => {
      const property = state.list.find(p => p.id === action.payload);
      if (property) {
        property.status = 'idle';
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    }
  }
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    }
  }
});

// Bookings slice
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    selectedDates: null
  },
  reducers: {
    addBooking: (state, action) => {
      state.list.push(action.payload);
    },
    cancelBooking: (state, action) => {
      state.list = state.list.filter(b => b.id !== action.payload);
    },
    setSelectedDates: (state, action) => {
      state.selectedDates = action.payload;
    }
  }
});

export const {
  addProperty,
  updateProperty,
  deleteProperty,
  removeProperty,
  setPropertyIdle,
  setSearchQuery,
  setFilters,
  setSelectedProperty
} = propertiesSlice.actions;

export const {
  login,
  logout,
  updateProfile
} = userSlice.actions;

export const {
  addBooking,
  cancelBooking,
  setSelectedDates
} = bookingsSlice.actions;

const store = configureStore({
  reducer: {
    properties: propertiesSlice.reducer,
    user: userSlice.reducer,
    bookings: bookingsSlice.reducer
  }
});

export default store;
