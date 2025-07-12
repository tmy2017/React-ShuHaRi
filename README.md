# Airbnb Clone - React Application

A modern Airbnb clone built with React, Redux Toolkit, and Vite. This application features property listings, search functionality, booking system, and user profiles with a beautiful, responsive design inspired by Airbnb's interface.

## 🚀 Features

### Core Functionality
- **Property Listings**: Browse beautiful property cards with images, ratings, and details
- **Advanced Search**: Search by location with real-time filtering
- **Smart Filters**: Filter by price range, guest count, and amenities
- **Property Details**: Detailed property pages with image galleries and descriptions
- **Booking System**: Interactive booking form with date selection and cost calculation
- **User Profiles**: User authentication and profile management
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **React Router**: Client-side routing for seamless navigation
- **Redux Toolkit**: State management for properties, users, and bookings
- **Smooth Animations**: CSS animations for property cards and interactions
- **Date Picker**: Integrated date selection for booking dates
- **Modern UI**: Clean, modern interface inspired by Airbnb's design system

## 🛠️ Technologies Used

- **React 19** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **React DatePicker** - Date selection component
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-shuhari
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   ├── SearchBar.jsx    # Search and filter component
│   ├── PropertyCard.jsx # Individual property display
│   ├── PropertyList.jsx # Grid of property cards
│   ├── PropertyDetails.jsx # Detailed property view
│   └── BookingForm.jsx  # Booking interface
├── pages/              # Page components
│   ├── Home.jsx        # Main listings page
│   ├── Property.jsx    # Individual property page
│   └── Profile.jsx     # User profile page
├── utils/              # Utility functions
│   └── helpers.js      # Date formatting, validation, etc.
├── store.js            # Redux store configuration
├── App.jsx             # Main app component with routing
└── App.css             # Comprehensive styling
```

## 🎨 Design Features

- **Airbnb-inspired UI**: Clean, modern design with consistent spacing and typography
- **Smooth Animations**: Property cards animate on hover and state changes
- **Responsive Grid**: Property listings adapt to different screen sizes
- **Interactive Elements**: Hover effects, image carousels, and smooth transitions
- **Professional Color Scheme**: Uses Airbnb's signature red (#ff385c) and neutral grays

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🌟 Key Components

### PropertyCard
Displays property information with image carousel, ratings, amenities, and pricing.

### SearchBar
Advanced search with location input and expandable filters panel.

### BookingForm
Interactive booking interface with date picker and cost calculation.

### Navigation
Responsive navigation with user authentication state.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚀 Future Enhancements

- Real backend integration
- User authentication with JWT
- Payment processing
- Real-time messaging
- Map integration
- Advanced filtering options
- Review and rating system
- Host dashboard

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
