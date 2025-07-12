import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, MapPin, Users, DollarSign, Filter } from 'lucide-react';
import { setSearchQuery, setFilters } from '../store';

function SearchBar() {
  const dispatch = useDispatch();
  const { searchQuery, filters } = useSelector(state => state.properties);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 1000,
      guests: 1,
      amenities: []
    };
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter(a => a !== amenity)
      : [...localFilters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const commonAmenities = ['WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'Fireplace', 'Beach Access'];

  return (
    <div className="search-bar">
      <div className="search-main">
        <div className="search-input-group">
          <MapPin className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Where are you going?"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
        
        <button className="search-button">
          <Search size={20} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label className="filter-label">
                <Users size={16} />
                Guests
              </label>
              <select
                value={localFilters.guests}
                onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                className="filter-select"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <DollarSign size={16} />
                Price Range
              </label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Amenities</label>
              <div className="amenities-grid">
                {commonAmenities.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`amenity-tag ${localFilters.amenities.includes(amenity) ? 'amenity-tag-active' : ''}`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={resetFilters} className="btn btn-secondary">
                Reset
              </button>
              <button onClick={applyFilters} className="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
