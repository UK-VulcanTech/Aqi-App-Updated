// src/components/map/MapDashboard.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  Marker,
  Tooltip,
  Circle,
} from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import custom components
import SearchBox from './SearchBox';
import MapClickHandler from './MapClickHandler';
import MarkerLayer from './MarkerLayer';
import HighlightedLocation from './HighlightedLocation';
import DistrictBoundaries from './DistrictBoundaries';
import CoverageArea from './CoverageArea';
import Sidebar from './Sidebar';
import MapControls from './MapControls';


// Import icon setup
import './IconSetup';
import PollutantsCard from './PollutantsCard';

// Replace with your actual API key
const OPEN_WEATHER_API_KEY = 'af9b0e0aad113409ea0d34be613e7881';

function MapDashboard() {
  // Start with an empty markers array instead of default locations
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);
  const [mode, setMode] = useState('view');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerForm, setMarkerForm] = useState({ name: '', type: 'poi' });
  const [highlightedLocation, setHighlightedLocation] = useState(null);

  // Air quality state
  const [airQuality, setAirQuality] = useState(null);
  const [airQualityLoading, setAirQualityLoading] = useState(false);
  const [regionalAirQuality, setRegionalAirQuality] = useState([]);
  // Updated to focus on Lahore
  const [mapBounds, setMapBounds] = useState({
    center: [31.5204, 74.3587],
    size: 0.5,
  });

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
            .leaflet-tooltip.custom-tooltip {
                background-color: transparent;
                border: none;
                box-shadow: none;
                color: black;
                font-weight: bold;
                padding: 0;
            }
            
            .leaflet-tooltip-top.custom-tooltip:before,
            .leaflet-tooltip-bottom.custom-tooltip:before,
            .leaflet-tooltip-left.custom-tooltip:before,
            .leaflet-tooltip-right.custom-tooltip:before {
                display: none;
            }
        `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      let locationName = 'Unknown Location';

      if (data.display_name) {
        const nameParts = data.display_name.split(',');
        if (nameParts.length > 0) {
          locationName = nameParts[0].trim();

          if (/^\d+$/.test(locationName) && nameParts.length > 1) {
            locationName += ', ' + nameParts[1].trim();
          }
        }
      }

      return locationName;
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Current Location';
    }
  };

  // Function to get AQI color based on the AQI index - updated colors to match image
  const getAQIColor = aqi => {
    switch (aqi) {
      case 1:
        return '#8ACA2B'; // Good (light green)
      case 2:
        return '#FCD93A'; // Fair (yellow)
      case 3:
        return '#F89939'; // Moderate (orange)
      case 4:
        return '#E8416F'; // Poor (red)
      case 5:
        return '#B03592'; // Very Poor (purple)
      default:
        return '#808080'; // Unknown (gray)
    }
  };

  // Function to get AQI label
  const getAQILabel = aqi => {
    switch (aqi) {
      case 1:
        return 'Good';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Poor';
      case 5:
        return 'Very Poor';
      default:
        return 'Unknown';
    }
  };

  // Function to fetch air quality data for a single point
  const fetchAirQuality = async (lat, lon) => {
    setAirQualityLoading(true);

    try {
      // Use highlighted location coordinates if lat/lon not provided
      const latitude = lat || highlightedLocation?.position?.[0] || 31.5204;
      const longitude = lon || highlightedLocation?.position?.[1] || 74.3587;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAirQuality(data.list[0]);
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    } finally {
      setAirQualityLoading(false);
    }
  };

  // Function to fetch multiple AQI points for a region
  const fetchRegionalAirQuality = async bounds => {
    setAirQualityLoading(true);

    try {
      // Create a grid of points within the bounds
      const points = [];
      const step = 0.05; // Adjust grid density as needed

      for (
        let lat = bounds.center[0] - bounds.size / 2;
        lat <= bounds.center[0] + bounds.size / 2;
        lat += step
      ) {
        for (
          let lon = bounds.center[1] - bounds.size / 2;
          lon <= bounds.center[1] + bounds.size / 2;
          lon += step
        ) {
          points.push({ lat, lon });
        }
      }

      // Limit to reasonable number of API calls (max 15 points to avoid rate limits)
      const samplePoints = points.slice(0, 15);

      // Fetch data for each point
      const promises = samplePoints.map(point =>
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${point.lat}&lon=${point.lon}&appid=${OPEN_WEATHER_API_KEY}`,
        )
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          })
          .then(data => ({
            lat: point.lat,
            lon: point.lon,
            aqi: data.list[0].main.aqi,
            value: Math.round(data.list[0].components.pm2_5), // Using PM2.5 as the display value
            components: data.list[0].components,
          })),
      );

      const results = await Promise.all(promises);
      setRegionalAirQuality(results);
    } catch (error) {
      console.error('Error fetching regional air quality data:', error);
    } finally {
      setAirQualityLoading(false);
    }
  };

  // Define Lahore bounds
  const lahoreBounds = L.latLngBounds(
    L.latLng(31.2, 74.1), // Southwest coordinates
    L.latLng(31.8, 74.6), // Northeast coordinates
  );

  // Function to enforce bounds
  const enforceBounds = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    // Check if the center is outside the bounds
    if (!lahoreBounds.contains(center)) {
      // Snap the map back to the nearest point within the bounds
      const newCenter = lahoreBounds.getCenter();
      map.flyTo(newCenter, zoom, { animate: false });
    }
  };

  // Handle map move to update bounds
  const handleMapMove = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = map.getBounds();
      const center = bounds.getCenter();
      const northEast = bounds.getNorthEast();
      const size = Math.max(
        Math.abs(northEast.lat - center.lat) * 2,
        Math.abs(northEast.lng - center.lng) * 2,
      );

      setMapBounds({
        center: [center.lat, center.lng],
        size,
      });
    }
  };

  // Set up initial location when the component mounts - focusing on Lahore
  useEffect(() => {
    // Set to Lahore coordinates
    const lahoreCoordinates = {
      latitude: 31.5204,
      longitude: 74.3587,
    };

    // If map is available, fly to location
    if (mapRef.current) {
      const map = mapRef.current;
      map.flyTo([lahoreCoordinates.latitude, lahoreCoordinates.longitude], 12);
    }

    // Get location name of Lahore
    const fetchLocationName = async () => {
      const locationName = await getAddressFromCoordinates(
        lahoreCoordinates.latitude,
        lahoreCoordinates.longitude,
      );

      // Create a highlighted location with the address
      setHighlightedLocation({
        position: [lahoreCoordinates.latitude, lahoreCoordinates.longitude],
        name: locationName || 'Lahore',
      });

      // Fetch air quality
      fetchAirQuality(lahoreCoordinates.latitude, lahoreCoordinates.longitude);
    };

    fetchLocationName();

    // Set initial bounds for regional air quality
    setMapBounds({
      center: [lahoreCoordinates.latitude, lahoreCoordinates.longitude],
      size: 0.5, // City-level view
    });
  }, []);

  // Fetch regional air quality when bounds change
  useEffect(() => {
    fetchRegionalAirQuality(mapBounds);
  }, [mapBounds]);

  // Add marker on map click
  const handleMapClick = position => {
    if (mode === 'edit') {
      const newMarker = {
        id: Date.now(),
        position,
        name: `New Location (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`,
        type: 'poi',
      };

      setMarkers(prev => [...prev, newMarker]);
      setSelectedMarker(newMarker);
      setMarkerForm({ name: newMarker.name, type: newMarker.type });
    }
  };

  // Handle search results
  const handleSearchResult = location => {
    console.log('Search result received:', location);

    // If search is successful, set the new highlighted location
    if (location) {
      // Fly to the location
      if (mapRef.current) {
        mapRef.current.flyTo(location.position, 14);
      }

      // Set highlighted location with the provided name
      setHighlightedLocation({
        position: location.position,
        name: location.name || 'Searched Location',
      });

      // Fetch air quality for the new location
      fetchAirQuality(location.position[0], location.position[1]);
    }
  };

  // Update marker data
  const updateMarker = () => {
    if (selectedMarker) {
      setMarkers(prev =>
        prev.map(marker =>
          marker.id === selectedMarker.id
            ? { ...marker, name: markerForm.name, type: markerForm.type }
            : marker,
        ),
      );
      setSelectedMarker(null);
    }
  };

  // Delete marker
  const deleteMarker = () => {
    if (selectedMarker) {
      setMarkers(prev =>
        prev.filter(marker => marker.id !== selectedMarker.id),
      );
      setSelectedMarker(null);
    }
  };

  // Component to render prettier AQI markers with fixed size
  const AQIMarkers = ({ airQualityData }) => {
    if (!airQualityData || airQualityData.length === 0) return null;

    return (
      <>
        {airQualityData.map((station, index) => {
          // Create a custom divIcon for fixed-size circle with enhanced styling
          const customIcon = divIcon({
            className: 'custom-div-icon',
            html: `
                        <div style="
                            background-color: ${getAQIColor(station.aqi)};
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: rgba(0, 0, 0, 0.8);
                            font-weight: bold;
                            font-size: 13px;
                            border: 2px solid white;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
                        ">
                            ${station.value}
                        </div>
                    `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          return (
            <Marker
              key={`aqi-${index}`}
              position={[station.lat, station.lon]}
              icon={customIcon}
              zIndexOffset={1000}
            >
              <Tooltip direction='top' className='custom-tooltip'>
                <div className='bg-white p-2 rounded shadow'>
                  <strong>AQI: {getAQILabel(station.aqi)}</strong>
                  <div>PM2.5: {station.value} μg/m³</div>
                  {station.components && (
                    <>
                      <div>
                        PM10: {Math.round(station.components.pm10)} μg/m³
                      </div>
                      <div>NO2: {Math.round(station.components.no2)} μg/m³</div>
                    </>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </>
    );
  };

  AQIMarkers.propTypes = {
    airQualityData: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lon: PropTypes.number,
        aqi: PropTypes.number,
        value: PropTypes.number,
        components: PropTypes.object,
      }),
    ),
  };

  return (
    <div className='bg-white rounded-xl shadow-xl overflow-hidden'>
      <MapControls mode={mode} setMode={setMode} />

      <div className='flex flex-col lg:flex-row'>
        <div className='w-full'>
          <div className='h-[850px]'>
            <MapContainer
              center={[31.5204, 74.3587]} // Lahore coordinates
              zoom={10} // City-level zoom
              minZoom={12}
              className='h-full w-full z-10'
              zoomControl={false}
              ref={mapRef}
              whenReady={map => {
                // Set up event listener for map movements
                map.target.on('moveend', enforceBounds);
              }}
              // Optional: restrict panning to Lahore region
              maxBounds={[
                [31.4, 74.2],
                [31.65, 74.5],
              ]}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <ZoomControl position='topright' />
              <SearchBox setHighlightedLocation={handleSearchResult} />

              {/* Show highlighted location with proper name */}
              {highlightedLocation && (
                <HighlightedLocation location={highlightedLocation} />
              )}

              {/* Air Quality Visualization for selected point */}
              {airQuality && highlightedLocation && (
                <Circle
                  center={highlightedLocation.position}
                  radius={2000} // 2km radius
                  pathOptions={{
                    fillColor: getAQIColor(airQuality.main.aqi),
                    color: getAQIColor(airQuality.main.aqi),
                    fillOpacity: 0.3,
                    weight: 2,
                  }}
                >
                  <Tooltip direction='top' permanent>
                    <div>
                      <strong>
                        Air Quality: {getAQILabel(airQuality.main.aqi)}
                      </strong>
                    </div>
                  </Tooltip>
                </Circle>
              )}

              {/* Regional AQI Markers */}
              <AQIMarkers airQualityData={regionalAirQuality} />

              <LayersControl position='topright'>
                <LayersControl.BaseLayer checked name='OpenStreetMap'>
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name='Watercolor'>
                  <TileLayer
                    url='https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay checked name='Points of Interest'>
                  <MarkerLayer
                    markers={markers}
                    mode={mode}
                    setSelectedMarker={setSelectedMarker}
                    setMarkerForm={setMarkerForm}
                  />
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name='Air Quality'>
                  <div>
                    {/* This div is needed as a container for LayersControl.Overlay */}
                    {/* AQI markers are rendered directly outside this control for visibility */}
                  </div>
                </LayersControl.Overlay>

                <LayersControl.Overlay name='Coverage Area'>
                  <CoverageArea />
                </LayersControl.Overlay>

                <LayersControl.Overlay name='District Boundaries'>
                  <DistrictBoundaries />
                </LayersControl.Overlay>
              </LayersControl>

              {mode === 'edit' && (
                <MapClickHandler onMapClick={handleMapClick} />
              )}
            </MapContainer>
          </div>
        </div>

        {/* <Sidebar
          mode={mode}
          markers={markers}
          highlightedLocation={highlightedLocation}
          selectedMarker={selectedMarker}
          markerForm={markerForm}
          setMarkerForm={setMarkerForm}
          updateMarker={updateMarker}
          deleteMarker={deleteMarker}
          setSelectedMarker={setSelectedMarker}
          airQuality={airQuality}
          airQualityLoading={airQualityLoading}
        /> */}
      </div>
      {regionalAirQuality.length > 0 && (
        <PollutantsCard regionalAirQuality={regionalAirQuality} />
      )}
    </div>
  );
}

export default MapDashboard;