import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Users, CreditCard } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { addBooking } from '../store';
import "react-datepicker/dist/react-datepicker.css";

function BookingForm({ property }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const subtotal = nights * property.price;
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxes = subtotal * 0.08; // 8% taxes
    return {
      nights,
      subtotal,
      serviceFee,
      taxes,
      total: subtotal + serviceFee + taxes
    };
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      alert('Please login to make a booking');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const booking = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      ...calculateTotal(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    dispatch(addBooking(booking));
    setShowBookingConfirm(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowBookingConfirm(false);
      setCheckIn(null);
      setCheckOut(null);
      setGuests(1);
    }, 3000);
  };

  const costs = calculateTotal();

  if (showBookingConfirm) {
    return (
      <div className="booking-form">
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h3>Booking Confirmed!</h3>
          <p>Your reservation has been successfully created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <div className="booking-header">
        <div className="price-display">
          <span className="price-amount">${property.price}</span>
          <span className="price-period">/ night</span>
        </div>
        <div className="rating-display">
          <span>★ {property.rating}</span>
          <span className="review-count">({property.reviews} reviews)</span>
        </div>
      </div>

      <div className="booking-inputs">
        <div className="date-inputs">
          <div className="date-input-group">
            <label className="input-label">
              <Calendar size={16} />
              Check-in
            </label>
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Add date"
              className="date-input"
            />
          </div>
          
          <div className="date-input-group">
            <label className="input-label">
              <Calendar size={16} />
              Check-out
            </label>
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Add date"
              className="date-input"
            />
          </div>
        </div>

        <div className="guests-input-group">
          <label className="input-label">
            <Users size={16} />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="guests-select"
          >
            {Array.from({ length: property.guests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} guest{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {checkIn && checkOut && (
        <div className="booking-summary">
          <div className="cost-breakdown">
            <div className="cost-item">
              <span>${property.price} × {costs.nights} night{costs.nights > 1 ? 's' : ''}</span>
              <span>${costs.subtotal.toFixed(2)}</span>
            </div>
            <div className="cost-item">
              <span>Service fee</span>
              <span>${costs.serviceFee.toFixed(2)}</span>
            </div>
            <div className="cost-item">
              <span>Taxes</span>
              <span>${costs.taxes.toFixed(2)}</span>
            </div>
            <div className="cost-total">
              <span>Total</span>
              <span>${costs.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <button 
        className="booking-button"
        onClick={handleBooking}
        disabled={!checkIn || !checkOut}
      >
        <CreditCard size={16} />
        {isAuthenticated ? 'Reserve' : 'Login to Reserve'}
      </button>

      <p className="booking-note">You won't be charged yet</p>
    </div>
  );
}

export default BookingForm;
