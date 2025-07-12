import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { User, Calendar, MapPin, Star } from 'lucide-react';

function Profile() {
  const { currentUser, isAuthenticated } = useSelector(state => state.user);
  const bookings = useSelector(state => state.bookings.list);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
            alt={currentUser.name}
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{currentUser.name}</h1>
          <p className="profile-email">{currentUser.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <User size={16} />
              <span>Member since 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2 className="section-title">Your Bookings</h2>
          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <Calendar size={48} />
              <h3>No bookings yet</h3>
              <p>When you book a trip, you'll see your reservations here.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h3 className="booking-property">{booking.propertyTitle}</h3>
                    <div className="booking-dates">
                      <Calendar size={16} />
                      <span>
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </span>
                    </div>
                    <div className="booking-details">
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="booking-status">
                    <div className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </div>
                    <div className="booking-total">
                      ${booking.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="profile-section">
          <h2 className="section-title">Account Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <User size={20} />
              <div>
                <h4>Personal Information</h4>
                <p>Update your name, email, and other details</p>
              </div>
            </div>
            <div className="setting-item">
              <Star size={20} />
              <div>
                <h4>Reviews</h4>
                <p>View and manage your reviews</p>
              </div>
            </div>
            <div className="setting-item">
              <MapPin size={20} />
              <div>
                <h4>Saved Places</h4>
                <p>View your favorite properties</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
