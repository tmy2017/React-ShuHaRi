import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Users } from 'lucide-react';
import clsx from 'clsx';

function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card-link">
      <div className={clsx(
        'property-card',
        property.status === 'entering' && 'property-card-enter',
        property.status === 'exiting' && 'property-card-exit',
        property.status === 'updating' && 'property-card-update'
      )}>
        <div className="property-image-container">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="property-image"
          />
          
          {property.images.length > 1 && (
            <>
              <button 
                className="image-nav image-nav-prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                className="image-nav image-nav-next"
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>
              <div className="image-dots">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'image-dot',
                      index === currentImageIndex && 'image-dot-active'
                    )}
                  />
                ))}
              </div>
            </>
          )}
          
          <button 
            className={clsx('like-button', isLiked && 'like-button-active')}
            onClick={toggleLike}
            aria-label="Add to favorites"
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="property-info">
          <div className="property-header">
            <h3 className="property-title">{property.title}</h3>
            <div className="property-rating">
              <Star size={14} fill="currentColor" />
              <span>{property.rating}</span>
              <span className="review-count">({property.reviews})</span>
            </div>
          </div>

          <div className="property-location">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>

          <div className="property-details">
            <div className="property-guests">
              <Users size={14} />
              <span>{property.guests} guests</span>
            </div>
            <span className="property-separator">•</span>
            <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
            <span className="property-separator">•</span>
            <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
          </div>

          <div className="property-amenities">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span key={amenity} className="amenity-badge">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="amenity-badge amenity-more">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>

          <div className="property-price">
            <span className="price-amount">${property.price}</span>
            <span className="price-period">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
