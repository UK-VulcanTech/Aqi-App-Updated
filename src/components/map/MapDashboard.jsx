// import {useEffect, useState} from 'react';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// import GeoRasterLayer from 'georaster-layer-for-leaflet';
// import parseGeoraster from 'georaster';
// import chroma from 'chroma-js';
// import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
// import SearchBox from './SearchBox';
// import PollutantsCard from './PollutantsCard';
// const GeoTiffLayer = () => {
//   const map = useMap();
//   useEffect(() => {
//     const loadGeoTiff = async (url, pollutant, layerControl) => {
//       try {
//         const response = await fetch(url);
//         if (!response.ok)
//           throw new Error(`Failed to load ${pollutant} GeoTIFF file`);
//         console.log('Response: ', response);
//         const arrayBuffer = await response.arrayBuffer();
//         console.log('Array Buffer: ', arrayBuffer);
//         const georaster = await parseGeoraster(arrayBuffer);
//         console.log('Georaster: ', georaster);
//         const colorScale = chroma
//           .scale(['green', 'yellow', 'orange', 'red', 'purple'])
//           .domain([0, 1]);
//         const layer = new GeoRasterLayer({
//           georaster,
//           opacity: 0.5,
//           pixelValuesToColorFn: values => {
//             const value = values[0];
//             const noDataValue = -9;
//             const minValue = georaster.mins[0];
//             const maxValue = georaster.maxs[0];
//             if (value === noDataValue || isNaN(value)) return null;
//             const scaledValue = (value - minValue) / (maxValue - minValue);
//             const color = colorScale(scaledValue).rgb();
//             return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7)`;
//           },
//         });
//         layerControl.addOverlay(layer, pollutant);
//         // layer.addTo(map);
//       } catch (error) {
//         console.error(`Error loading ${pollutant} GeoTIFF:`, error);
//       }
//     };
//     // Create Layer Control
//     const baseLayers = {};
//     const overlayLayers = {};
//     // Add GeoTIFF layers as overlays
//     const layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);
//     loadGeoTiff('/data/S5P_NO2_Clipped.tif', 'NO2', layerControl);
//     loadGeoTiff('/data/S5P_O3_Clipped.tif', 'O3', layerControl);
//     // Add legend only after the map is ready
//     map.whenReady(() => {
//       if (document.querySelector('.leaflet-legend')) return;
//       const legend = L.control({position: 'bottomright'});
//       legend.onAdd = () => {
//         const div = L.DomUtil.create('div', 'leaflet-legend info legend');
//         div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
//         div.style.padding = '10px';
//         div.style.borderRadius = '5px';
//         div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.3)';
//         div.innerHTML = `
//     <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Pollutant Levels</h4>
//     <div style="display: flex; align-items: center; margin-bottom: 4px;">
//       <div style="width: 12px; height: 12px; background-color: rgba(0, 128, 0, 0.2); margin-right: 5px;"></div>
//       <span style="font-size: 12px;">Low (<20 μg/m³)</span>
//     </div>
//     <div style="display: flex; align-items: center; margin-bottom: 4px;">
//       <div style="width: 12px; height: 12px; background-color: rgba(180, 180, 0, 0.2); margin-right: 5px;"></div>
//       <span style="font-size: 12px;">Medium-Low (20-40)</span>
//     </div>
//     <div style="display: flex; align-items: center; margin-bottom: 4px;">
//       <div style="width: 12px; height: 12px; background-color: rgba(200, 120, 0, 0.2); margin-right: 5px;"></div>
//       <span style="font-size: 12px;">Medium (40-60)</span>
//     </div>
//     <div style="display: flex; align-items: center; margin-bottom: 4px;">
//       <div style="width: 12px; height: 12px; background-color: rgba(180, 0, 0, 0.2); margin-right: 5px;"></div>
//       <span style="font-size: 12px;">Medium-High (60-80)</span>
//     </div>
//     <div style="display: flex; align-items: center;">
//       <div style="width: 12px; height: 12px; background-color: rgba(100, 0, 100, 0.2); margin-right: 5px;"></div>
//       <span style="font-size: 12px;">High (>80 μg/m³)</span>
//     </div>
//   `;
//         return div;
//       };
//       legend.addTo(map);
//     });
//     return () => {
//       map.eachLayer(layer => {
//         if (layer instanceof GeoRasterLayer) {
//           map.removeLayer(layer);
//         }
//       });
//       layerControl.remove();
//     };
//   }, [map]);
//   return null;
// };
// const MapDashboard = () => {
//   const [highlightedLocation, setHighlightedLocation] = useState(null);
//   const handleSearchResult = location => {
//     if (location) {
//       setHighlightedLocation({
//         position: location.position,
//         name: location.name || 'Searched Location',
//       });
//     }
//   };
//   return (
//     <MapContainer
//       center={[31.5497, 74.3436]}
//       zoom={11}
//       minZoom={12}
//       style={{height: '90vh', width: '100%', zIndex: 0}}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="© OpenStreetMap contributors"
//       />
//       <GeoTiffLayer />
//       <SearchBox setHighlightedLocation={handleSearchResult} />
//       <PollutantsCard />
//       {highlightedLocation && (
//         <Marker position={highlightedLocation.position}>
//           <Popup>{highlightedLocation.name}</Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };
// export default MapDashboard;
