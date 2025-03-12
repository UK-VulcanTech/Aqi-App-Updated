// src/components/map/HighlightedLocation.jsx
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

function HighlightedLocation({ location }) {
    if (!location) return null;

    // Custom icon for highlighted location
    const highlightIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <Marker
            position={location.position}
            icon={highlightIcon}
        >
            <Popup autoOpen={true}>
                <div>
                    <h3 className="font-bold text-red-600">Searched Location</h3>
                    <p className="text-sm">{location.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                        {location.position[0].toFixed(6)}, {location.position[1].toFixed(6)}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}

HighlightedLocation.propTypes = {
    location: PropTypes.shape({
        position: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired
    })
};

export default HighlightedLocation;