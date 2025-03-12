// src/components/map/SearchBox.jsx
import { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import { ioIcons, mdIcons } from '../../global/icons';

// Define Lahore's approximate bounding box
const LAHORE_BOUNDS = {
  minLat: 31.40,
  maxLat: 31.70,
  minLng: 74.20,
  maxLng: 74.50,
};

// Function to search for locations within Lahore only
async function searchLocations(query) {
  if (!query || query.trim().length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Lahore')}&limit=5`,
    );
    const data = await response.json();

    return data
      .filter(item => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        return (
          lat >= LAHORE_BOUNDS.minLat &&
          lat <= LAHORE_BOUNDS.maxLat &&
          lng >= LAHORE_BOUNDS.minLng &&
          lng <= LAHORE_BOUNDS.maxLng
        );
      })
      .map(item => ({
        id: item.place_id,
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

function SearchBox({ setHighlightedLocation }) {
  const map = useMap();
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchText(value);
    setError('');

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length >= 3) {
      setIsLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await searchLocations(value);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = suggestion => {
    setSearchText(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    map.flyTo([suggestion.lat, suggestion.lng], 14);
    setHighlightedLocation({
      position: [suggestion.lat, suggestion.lng],
      name: suggestion.name,
    });
  };

  const handleSearch = async e => {
    e.preventDefault();
    setError('');
    setShowSuggestions(false);

    if (!searchText.trim()) return;

    try {
      setIsLoading(true);
      const results = await searchLocations(searchText);
      if (results.length > 0) {
        const lahoreResult = results[0]; // Assuming the first result is the most relevant
        map.flyTo([lahoreResult.lat, lahoreResult.lng], 14);
        setHighlightedLocation({
          position: [lahoreResult.lat, lahoreResult.lng],
          name: lahoreResult.name,
        });
      } else {
        setError('Only Lahore locations are allowed.');
      }
    } catch (error) {
      console.log(error);
      setError('Location not found. Try another search term.');
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14);
        setHighlightedLocation({
          position: [latitude, longitude],
          name: `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        });
        console.log('Latitude:', latitude, 'Longitude:', longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };
  
  return (
    <div className='leaflet-top leaflet-right mt-0 mr-22 z-[1000]' ref={wrapperRef}>
      <div className='leaflet-control shadow-none'>
        <div className='p-2 rounded-md shadow-lg bg-theme-black'>
          <form onSubmit={handleSearch} className='flex flex-col'>
            <div className='flex items-center relative'>
              <p className='text-xl text-white'>{ioIcons.IoIosSearch}</p>
              <input
                type='text'
                placeholder='Search Lahore location (e.g., Gulberg)'
                value={searchText}
                onChange={handleSearchChange}
                className='px-3 py-2 rounded-l-md focus:outline-none text-sm bg-transparent text-white'
                style={{ width: '220px', color: 'white' }}
              />
              <p onClick={handleCurrentLocation} className='text-lg p-1 text-amber-300'>{mdIcons.MdMyLocation}</p>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-full max-w-xs'>
                <ul className='max-h-60 overflow-y-auto py-1'>
                  {suggestions.map(suggestion => (
                    <li
                      key={suggestion.id}
                      className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm truncate'
                      onClick={() => handleSelectSuggestion(suggestion)}
                      title={suggestion.name}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

SearchBox.propTypes = {
  setHighlightedLocation: PropTypes.func.isRequired,
};

export default SearchBox;