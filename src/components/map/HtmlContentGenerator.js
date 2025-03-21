// HtmlContentGenerator.js
const generateHtmlContent = () => {
    return `
     <!DOCTYPE html>
     <html>
     <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
       <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
       <script src="https://unpkg.com/geotiff"></script>
       <script src="https://unpkg.com/georaster"></script>
       <script src="https://unpkg.com/georaster-layer-for-leaflet"></script>
       <style>
         html, body { 
           margin: 0; 
           padding: 0; 
           height: 100%; 
           width: 100%;
           overflow: hidden;
           touch-action: manipulation;
           -webkit-overflow-scrolling: touch;
         }
         #map { 
           position: absolute; 
           top: 0; 
           bottom: 0; 
           width: 100%; 
           height: 100%;
           touch-action: manipulation;
           z-index: 1;
         }
         .custom-popup .leaflet-popup-content-wrapper {
           background: rgba(255, 255, 255, 0.9);
           border-radius: 5px;
         }
         .marker-info {
           padding: 5px;
           font-family: Arial, sans-serif;
         }
         .marker-title {
           font-weight: bold;
           margin-bottom: 5px;
         }
         .marker-description {
           font-size: 0.9em;
         }
         .marker-value {
           font-weight: bold;
           font-size: 1.1em;
           color: #d32f2f;
         }
         .marker-coordinates {
           font-size: 0.8em;
           color: #666;
         }
         .info-box {
           padding: 8px;
           background: white;
           border-radius: 5px;
           box-shadow: 0 0 15px rgba(0,0,0,0.2);
           position: absolute;
           bottom: 20px;
           right: 20px;
           z-index: 1000;
           max-width: 300px;
           font-family: Arial, sans-serif;
         }
         .zoom-controls {
           position: absolute;
           top: 20px;
           right: 20px;
           z-index: 1000;
           display: flex;
           flex-direction: column;
         }
         .zoom-btn {
           width: 40px;
           height: 40px;
           background: white;
           border-radius: 4px;
           margin-bottom: 8px;
           display: flex;
           justify-content: center;
           align-items: center;
           font-size: 24px;
           font-weight: bold;
           box-shadow: 0 2px 5px rgba(0,0,0,0.2);
           cursor: pointer;
           user-select: none;
           -webkit-user-select: none;
         }
         .zoom-btn:active {
           background: #f0f0f0;
         }
       </style>
     </head>
     <body>
       <div id="map"></div>
       <div class="zoom-controls">
         <div class="zoom-btn" id="zoom-in">+</div>
         <div class="zoom-btn" id="zoom-out">-</div>
       </div>
       <script>
         // Explicitly enable touch detection
         L.Browser.touch = true;
         L.Browser.pointer = false;
         L.Browser.mobile = true;
         
         // Initialize map with touch zoom and drag enabled, and set minimum zoom
         var map = L.map('map', {
           zoomControl: false,
           tap: true,
           dragging: true,
           touchZoom: true,
           scrollWheelZoom: true,
           doubleClickZoom: true,
           boxZoom: true,
           bounceAtZoomLimits: true,
           inertia: true,
           inertiaDeceleration: 3000,
           inertiaMaxSpeed: 1500,
           zoomAnimationThreshold: 4,
           minZoom: 11,  // Set minimum zoom level to prevent seeing outside Lahore
           maxZoom: 18,  // Set maximum zoom level
           maxBoundsViscosity: 1.0  // Make bounds "sticky" - prevents bouncing outside bounds
         }).setView([31.5204, 74.3587], 12); // Lahore, with higher initial zoom
  
         // Define Lahore bounds more strictly
         const lahoreBounds = L.latLngBounds(
           L.latLng(31.3, 74.1),  // Southwest corner
           L.latLng(31.7, 74.6)   // Northeast corner
         );
  
         map.setMaxBounds(lahoreBounds);
  
         // Add multiple event handlers to really ensure we stay within bounds
         map.on('drag', function() {
           map.panInsideBounds(lahoreBounds, { animate: false });
         });
  
         map.on('zoomend', function() {
           if (map.getZoom() < 11) {
             map.setZoom(11);
             debug("Zoom restricted to minimum level");
           }
           map.panInsideBounds(lahoreBounds, { animate: false });
         });
  
         map.on('moveend', function() {
           map.panInsideBounds(lahoreBounds, { animate: true });
         });
         
         var tiffLayer = null;
         var markers = [];
         var csvMarkers = [];
         var currentInfoBox = null;
         
         // Add OpenStreetMap base layer
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; OpenStreetMap contributors'
         }).addTo(map);
         
         // Debug function to send messages back to React Native
         function debug(message) {
           window.ReactNativeWebView.postMessage(message);
         }
         
         // Specific handler for touch events
         document.addEventListener('touchstart', function(e) {
           if (e.touches.length > 1) {
             map._enforcingBounds = false;
             debug("Multi-touch detected");
           }
         }, { passive: false });
         
         // Connect zoom button events
         document.getElementById('zoom-in').addEventListener('click', function() {
           map.zoomIn();
         });
         
         document.getElementById('zoom-out').addEventListener('click', function() {
           map.zoomOut();
         });
         
         // Let React Native know the map is ready
         debug("Map initialized");
         
         // Function to zoom the map programmatically
         function zoomMap(direction) {
           if (direction === 'in') {
             map.zoomIn();
             debug("Zoomed in to level: " + map.getZoom());
           } else if (direction === 'out') {
             map.zoomOut();
             debug("Zoomed out to level: " + map.getZoom());
           }
         }
         
         // Function to search for a location - No local search, API only
         function searchLocation(query) {
           debug("Searching for: " + query);
           
           // Only search with Nominatim API
           fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query + ' lahore pakistan'), {
             headers: {
               'User-Agent': 'LahoreMapApp/1.0'
             }
           })
             .then(response => response.json())
             .then(data => {
               if (data && data.length > 0) {
                 // Filter to only include results in Lahore area
                 const results = data
                   .filter(item => {
                     const lat = parseFloat(item.lat);
                     const lon = parseFloat(item.lon);
                     // Check if coordinates are within Lahore bounds
                     return lat >= 31.3 && lat <= 31.7 && lon >= 74.1 && lon <= 74.6;
                   })
                   .slice(0, 5)
                   .map(item => ({
                     name: item.display_name,
                     lat: parseFloat(item.lat),
                     lon: parseFloat(item.lon),
                     description: item.type || 'Location in Lahore'
                   }));
                 
                 window.ReactNativeWebView.postMessage(JSON.stringify({
                   type: 'searchResults',
                   results: results
                 }));
                 debug("Found " + results.length + " locations");
               } else {
                 debug("No locations found");
                 window.ReactNativeWebView.postMessage(JSON.stringify({
                   type: 'searchResults',
                   results: []
                 }));
               }
             })
             .catch(error => {
               debug("Error searching: " + error.message);
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'searchError',
                 error: error.message
               }));
             });
         }     
         
         // Function to go to a specific location and add a marker
         function goToLocation(lat, lon, title, description) {
           // Ensure location is within Lahore bounds
           const latlng = L.latLng(lat, lon);
           if (!lahoreBounds.contains(latlng)) {
             debug("Location outside Lahore: " + title);
             // Default to Lahore center
             lat = 31.5204;
             lon = 74.3587;
             title = "Lahore";
             description = "City in Pakistan";
           }
           
           // Set map view to location
           map.setView([lat, lon], 13);
           
           // Add marker
           addMarker(lat, lon, title, description);
           
           debug("Moved to location: " + title);
         }
         
         // Function to add a marker to the map
         function addMarker(lat, lon, title, description) {
           // Remove previous search markers
           clearMarkers();
           
           const marker = L.marker([lat, lon]).addTo(map);
           
           // Create popup content
           const popupContent = '<div class="marker-info">' +
                               '<div class="marker-title">' + title + '</div>' +
                               '<div class="marker-description">' + description + '</div>' +
                               '</div>';
           
           marker.bindPopup(popupContent, { className: 'custom-popup' });
           marker.openPopup();
           
           markers.push(marker);
           return marker;
         }
         
         // Function to clear all markers
         function clearMarkers() {
           markers.forEach(marker => {
             map.removeLayer(marker);
           });
           markers = [];
         }
  
         // Function to clear all CSV markers
         function clearCSVMarkers() {
           csvMarkers.forEach(marker => {
             map.removeLayer(marker);
           });
           csvMarkers = [];
           debug("Cleared CSV markers");
         }
  
         // Function to add CSV data points as invisible markers
         function addCSVMarkers(points) {
           debug("Adding " + points.length + " invisible CSV markers");
           
           points.forEach(point => {
             // Create a circular marker with opacity 0 (invisible)
             const circleMarker = L.circleMarker([point.lat, point.lon], {
               radius: 15, // Larger clickable area
               fillColor: getValueColor(point.value),
               color: '#fff',
               weight: 0,
               opacity: 0,
               fillOpacity: 0 // Set to 0 to make invisible
             }).addTo(map);
             
             // Add popup with value information
             circleMarker.bindPopup(
               '<div class="marker-info">' +
               '<div class="marker-title">' + point.type + '</div>' +
               '<div class="marker-value">Value: ' + point.value.toFixed(2) + '</div>' +
               '<div class="marker-coordinates">Lat: ' + point.lat.toFixed(5) + ', Lon: ' + point.lon.toFixed(5) + '</div>' +
               '</div>'
             );
             
             // Add click handler to notify React Native
             circleMarker.on('click', function(e) {
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'csvMarkerClick',
                 data: {
                   lat: point.lat,
                   lon: point.lon,
                   value: point.value,
                   markerType: point.type
                 }
               }));
             });
             
             csvMarkers.push(circleMarker);
           });
           
           debug("Added " + points.length + " invisible CSV markers");
         }
  
         // Helper function to get color based on value
         function getValueColor(value) {
           // Color scale for visualization
           if (value < 0.2) return '#00FF00';      // green (low)
           else if (value < 0.4) return '#FFFF00'; // yellow (medium-low)
           else if (value < 0.6) return '#FFA500'; // orange (medium)
           else if (value < 0.8) return '#FF0000'; // red (medium-high)
           else return '#800080';                  // purple (high)
         }
         
         // Simplified function to display information about current view
         function showCurrentLocation() {
           const center = map.getCenter();
           const zoom = map.getZoom();
           
           // Create a basic info box with coordinates
           if (currentInfoBox) {
             map.removeControl(currentInfoBox);
           }
           
           const infoBoxControl = L.Control.extend({
             options: {
               position: 'bottomright'
             },
             onAdd: function() {
               const div = L.DomUtil.create('div', 'info-box');
               div.innerHTML = '<strong>Current View:</strong><br>' +
                              '<strong>Coordinates:</strong> ' + 
                              center.lat.toFixed(4) + ', ' + center.lng.toFixed(4) + '<br>' +
                              '<strong>Zoom Level:</strong> ' + zoom;
               return div;
             }
           });
           
           currentInfoBox = new infoBoxControl();
           map.addControl(currentInfoBox);
           
           debug("Map info updated");
         }
         
         // Listen for map move events
         map.on('moveend', function() {
           debug("Map moved");
         });
         
         // Listen for zoom events
         map.on('zoomend', function() {
           debug("Map zoomed to level: " + map.getZoom());
         });
       </script>
     </body>
     </html>
   `;
};

export default generateHtmlContent;
