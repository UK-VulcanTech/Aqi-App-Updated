// src/components/map/IconSetup.js
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const getMarkerIcon = (type) => {
    const iconUrl = type === 'park'
        ? 'https://cdn-icons-png.flaticon.com/512/616/616452.png'
        : icon;

    return new L.Icon({
        iconUrl,
        shadowUrl: iconShadow,
        iconSize: type === 'park' ? [30, 30] : [25, 41],
        iconAnchor: type === 'park' ? [15, 15] : [12, 41]
    });
};