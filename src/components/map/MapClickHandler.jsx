// src/components/map/MapClickHandler.jsx
import PropTypes from 'prop-types';
import { useMapEvents } from 'react-leaflet';

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onMapClick([lat, lng]);
        }
    });

    return null;
}

MapClickHandler.propTypes = {
    onMapClick: PropTypes.func.isRequired
};

export default MapClickHandler;