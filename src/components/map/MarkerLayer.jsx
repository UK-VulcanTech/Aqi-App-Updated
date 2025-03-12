// src/components/map/MarkerLayer.jsx
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { getMarkerIcon } from './IconSetup';

function MarkerLayer({ markers, mode, setSelectedMarker, setMarkerForm }) {
    return (
        <>
            {markers.map(marker => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={getMarkerIcon(marker.type)}
                    eventHandlers={{
                        click: () => {
                            if (mode === 'edit') {
                                setSelectedMarker(marker);
                                setMarkerForm({ name: marker.name, type: marker.type });
                            }
                        }
                    }}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold">{marker.name}</h3>
                            <p className="text-sm text-gray-600">
                                {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                            </p>
                            <p className="text-xs uppercase mt-1 text-gray-500">
                                {marker.type}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

MarkerLayer.propTypes = {
    markers: PropTypes.array.isRequired,
    mode: PropTypes.string.isRequired,
    setSelectedMarker: PropTypes.func.isRequired,
    setMarkerForm: PropTypes.func.isRequired
};

export default MarkerLayer;