import { useState } from 'react';
import { Star, MapPin, Users, Bed, Bath, Heart, Share } from 'lucide-react';
import BookingForm from './BookingForm';

function PropertyDetails({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!property) {
    return (
      <div className="property-not-found">
        <h2>Property not found</h2>
        <p>The property you're looking for doesn't exist.</p>
      </div>
    );
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="property-details">
      <div className="property-header">
        <div className="property-title-section">
          <h1 className="property-title">{property.title}</h1>
          <div className="property-meta">
            <div className="property-rating">
              <Star size={16} fill="currentColor" />
              <span>{property.rating}</span>
              <span className="review-count">({property.reviews} reviews)</span>
            </div>
            <div className="property-location">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
          </div>
        </div>
        
        <div className="property-actions">
          <button 
            className={`action-btn ${isLiked ? 'action-btn-active' : ''}`}
            onClick={toggleLike}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>Save</span>
          </button>
          <button className="action-btn">
            <Share size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="property-images">
        <div className="main-image">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="property-main-image"
          />
        </div>
        {property.images.length > 1 && (
          <div className="image-thumbnails">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`thumbnail ${index === currentImageIndex ? 'thumbnail-active' : ''}`}
              >
                <img src={image} alt={`${property.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="property-content">
        <div className="property-main-content">
          <div className="property-host">
            <h2>Hosted by {property.host}</h2>
            <div className="property-specs">
              <span><Users size={16} /> {property.guests} guests</span>
              <span><Bed size={16} /> {property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}</span>
              <span><Bath size={16} /> {property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="property-description">
            <h3>About this place</h3>
            <p>{property.description}</p>
          </div>

          <div className="property-amenities-section">
            <h3>What this place offers</h3>
            <div className="amenities-list">
              {property.amenities.map(amenity => (
                <div key={amenity} className="amenity-item">
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="property-booking-sidebar">
          <BookingForm property={property} />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
