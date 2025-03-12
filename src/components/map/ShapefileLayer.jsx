import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import parseGeoraster from 'georaster';
import chroma from 'chroma-js'; // For color scaling

const ShapefileLayer = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Initialize the map
    mapInstance.current = L.map(mapRef.current).setView([31.5497, 74.3436], 10);

    // Add a base tile layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    // Create a legend control that will appear on the map
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.3)';
      div.style.maxWidth = '200px';

      // Using more muted colors for the legend
      div.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">NO2 Levels</h4>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background-color: rgba(0, 128, 0, 0.2); margin-right: 5px;"></div>
          <span style="font-size: 12px;">Low (<20 μg/m³)</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background-color: rgba(180, 180, 0, 0.2); margin-right: 5px;"></div>
          <span style="font-size: 12px;">Medium-Low (20-40)</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background-color: rgba(200, 120, 0, 0.2); margin-right: 5px;"></div>
          <span style="font-size: 12px;">Medium (40-60)</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <div style="width: 12px; height: 12px; background-color: rgba(180, 0, 0, 0.2); margin-right: 5px;"></div>
          <span style="font-size: 12px;">Medium-High (60-80)</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 12px; height: 12px; background-color: rgba(100, 0, 100, 0.2); margin-right: 5px;"></div>
          <span style="font-size: 12px;">High (>80 μg/m³)</span>
        </div>
      `;

      return div;
    };

    // Add the legend to the map
    legend.addTo(mapInstance.current);

    // Load and display the GeoTIFF file
    const loadGeoTiff = async () => {
      try {
        // Replace with the path to your .tif file
        const response = await fetch('/NO2_clipped_subarea.tif');
        if (!response.ok) throw new Error('Failed to load GeoTIFF file');
        const arrayBuffer = await response.arrayBuffer();
        const georaster = await parseGeoraster(arrayBuffer);
        console.log('GeoTIFF metadata:', georaster); // Log metadata for debugging
        console.log('Min Value:', georaster.mins, 'Max Value:', georaster.maxs);

        // Define the custom color scale with more muted colors to match the legend
        const colorScale = chroma
          .scale([
            'rgba(0, 128, 0, 0.2)',
            'rgba(180, 180, 0, 0.7)',
            'rgba(200, 120, 0, 0.7)',
            'rgba(180, 0, 0, 0.7)',
            'rgba(100, 0, 100, 0.7)',
          ])
          .domain([0, 1]); // Map values from 0 to 1

        // Create a GeoRasterLayer with the custom color mapping
        const layer = new GeoRasterLayer({
          georaster,
          opacity: 0.2,
          pixelValuesToColorFn: values => {
            const value = values[0]; // Assuming single-band GeoTIFF
            const noDataValue = -9;
            const minValue = georaster.mins[0];
            const maxValue = georaster.maxs[0];
            // Handle no-data values
            if (value === noDataValue || isNaN(value)) return null;
            // Scale the value to 0–1
            const scaledValue = (value - minValue) / (maxValue - minValue);
            // Map the scaled value to a color using the custom scale
            const color = colorScale(scaledValue).rgb();
            return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7)`;
          },
        });

        // Add the layer to the map
        layer.addTo(mapInstance.current);
      } catch (error) {
        console.error('Error loading GeoTIFF:', error);
      }
    };

    loadGeoTiff();

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default ShapefileLayer;
