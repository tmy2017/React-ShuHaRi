import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, User, Heart, Menu } from 'lucide-react';
import { logout } from '../store';

function Navigation() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector(state => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Home className="nav-logo-icon" />
          <span className="nav-logo-text">Airbnb Clone</span>
        </Link>

        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button className="nav-link nav-logout" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              className="nav-link nav-login"
              onClick={() => {
                // Simple mock login for demo
                dispatch({
                  type: 'user/login',
                  payload: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
                  }
                });
              }}
            >
              <User size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
