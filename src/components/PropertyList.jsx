import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { setPropertyIdle, removeProperty } from '../store';

function PropertyList() {
  const dispatch = useDispatch();
  const { list: properties, searchQuery, filters } = useSelector(state => state.properties);

  // Handle animation transitions
  useEffect(() => {
    const timers = [];
    properties.forEach(property => {
      if (property.status === 'entering' || property.status === 'updating') {
        timers.push(setTimeout(() => {
          dispatch(setPropertyIdle(property.id));
        }, 400));
      }
      if (property.status === 'exiting') {
        timers.push(setTimeout(() => {
          dispatch(removeProperty(property.id));
        }, 400));
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [properties, dispatch]);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    // Search query filter
    if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price filter
    if (property.price < filters.minPrice || property.price > filters.maxPrice) {
      return false;
    }

    // Guests filter
    if (property.guests < filters.guests) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });

  if (filteredProperties.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h3>No properties found</h3>
          <p>Try adjusting your search criteria or filters to find more properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-list">
      <div className="property-grid">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
