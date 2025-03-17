// LahoreMap.js
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import SearchBox from './SearchBox';
import Papa from 'papaparse';

const LahoreMap = () => {
  const [status, setStatus] = useState('Ready');
  const [tiffLoading, setTiffLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPollutantDropdown, setShowPollutantDropdown] = useState(false);
  const webViewRef = useRef(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [showPollutionCard, setShowPollutionCard] = useState(false);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [csvMarkers, setCsvMarkers] = useState([]);

  // Define different pollutant layers - ensuring consistent capitalization
  const tiffLayers = [
    {
      name: 'NO2 Concentration',
      filename: 'NO2_clipped.tif',
      csvFilename: 'NO2_clipped.csv',
      description: 'Nitrogen Dioxide pollution levels',
    },
    {
      name: 'CH4 Levels',
      filename: 'CH4_clipped.tif',
      csvFilename: 'CH4_clipped.csv',
      description: 'Methane concentration',
    },
    {
      name: 'Ozone Levels',
      filename: 'O3_clipped.tif',
      csvFilename: 'O3_clipped.csv',
      description: 'Ground-level ozone concentration',
    },
    {
      name: 'SO2 Emissions',
      filename: 'SO2_clipped.tif',
      csvFilename: 'SO2_clipped.csv',
      description: 'Sulfur Dioxide emission data',
    },
    {
      name: 'PM2.5 Levels',
      filename: 'PM25_clipped.tif',
      csvFilename: 'PM25_clipped.csv',
      description: 'Particulate Matter (PM2.5) concentration',
    },
  ];

  // Predefined locations
  const predefinedLocations = [
    {
      name: 'Gulberg',
      lat: 31.5204,
      lon: 74.3587,
      description: 'Residential area',
    },
    {name: 'Downtown', lat: 31.5497, lon: 74.3436, description: 'City center'},
    {
      name: 'Industrial Zone',
      lat: 31.5102,
      lon: 74.3389,
      description: 'Manufacturing area',
    },
  ];

  // Additional common locations in Lahore for dynamic search
  const commonLocations = [
    {
      name: 'Lahore',
      lat: 31.5204,
      lon: 74.3587,
      description: 'City in Pakistan',
    },
    {
      name: 'Johar Town',
      lat: 31.4697,
      lon: 74.2728,
      description: 'Lahore district',
    },
    {
      name: 'Model Town',
      lat: 31.4793,
      lon: 74.3248,
      description: 'Residential area',
    },
    {
      name: 'DHA Lahore',
      lat: 31.4794,
      lon: 74.4214,
      description: 'Defense Housing Authority',
    },
    {
      name: 'Badshahi Mosque',
      lat: 31.583,
      lon: 74.3097,
      description: 'Historical landmark',
    },
    {
      name: 'Liberty Market',
      lat: 31.5161,
      lon: 74.3385,
      description: 'Shopping center',
    },
    {
      name: 'Shalimar Gardens',
      lat: 31.5883,
      lon: 74.3812,
      description: 'Historical garden',
    },
    {
      name: 'Fortress Stadium',
      lat: 31.5342,
      lon: 74.3438,
      description: 'Entertainment complex',
    },
    {
      name: 'Punjab University',
      lat: 31.4987,
      lon: 74.2972,
      description: 'Educational institution',
    },
    {
      name: 'Allama Iqbal International Airport',
      lat: 31.5214,
      lon: 74.4035,
      description: 'Airport',
    },
  ];

  // Combined location data source for dynamic searching
  const allLocations = [...predefinedLocations, ...commonLocations];

  // Helper function to determine status based on value
  const getStatusFromValue = value => {
    if (value < 0.2) return 'Good';
    else if (value < 0.4) return 'Moderate';
    else if (value < 0.6) return 'Unhealthy for Sensitive Groups';
    else if (value < 0.8) return 'Unhealthy';
    else return 'Hazardous';
  };

  // Initial HTML with Leaflet map
  const htmlContent = `
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
       
       // Initialize map with touch zoom and drag enabled
       var map = L.map('map', {
         zoomControl: false,
         tap: true,
         dragging: true,
         touchZoom: true,
         scrollWheelZoom: true,
         doubleClickZoom: true,
         boxZoom: true,
         bounceAtZoomLimits: false,
         inertia: true,
         inertiaDeceleration: 3000,
         inertiaMaxSpeed: 1500,
         zoomAnimationThreshold: 4
       }).setView([31.5204, 74.3587], 11); // Lahore
       
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
       
       // Function to search for a location - RESTORED
       function searchLocation(query) {
         debug("Searching for: " + query);
         
         // First try local search
         window.ReactNativeWebView.postMessage(JSON.stringify({
           type: 'localSearch',
           query: query
         }));
         
         // Then try with Nominatim API
         fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query), {
           headers: {
             'User-Agent': 'LahoreMapApp/1.0'
           }
         })
           .then(response => response.json())
           .then(data => {
             if (data && data.length > 0) {
               const results = data.slice(0, 5).map(item => ({
                 name: item.display_name,
                 lat: parseFloat(item.lat),
                 lon: parseFloat(item.lon)
               }));
               
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'searchResults',
                 results: results
               }));
               debug("Found " + results.length + " locations");
             } else {
               debug("No online locations found");
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'searchResults',
                 results: []
               }));
             }
           })
           .catch(error => {
             debug("Error searching: " + error.message);
             // We already tried local search
             window.ReactNativeWebView.postMessage(JSON.stringify({
               type: 'searchError',
               error: error.message
             }));
           });
       }
       
       // Function to go to a specific location and add a marker
       function goToLocation(lat, lon, title, description) {
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

       // Function to add CSV data points as markers
       function addCSVMarkers(points) {
         debug("Adding " + points.length + " CSV markers");
         
         points.forEach(point => {
           // Create a circular marker with size based on value
           const radius = Math.min(Math.max(point.value * 0.05, 5), 15); // Adjust scale as needed
           
           const circleMarker = L.circleMarker([point.lat, point.lon], {
             radius: radius,
             fillColor: getValueColor(point.value),
             color: '#fff',
             weight: 1,
             opacity: 1,
             fillOpacity: 0.8
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
         
         debug("Added " + points.length + " CSV markers");
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

  // Function to perform dynamic local search - This is needed in both components
  const performLocalSearch = query => {
    if (!query || query.length < 2) return [];

    query = query.toLowerCase();

    // Search through all locations dynamically
    const results = allLocations.filter(
      location =>
        location.name.toLowerCase().includes(query) ||
        (location.description &&
          location.description.toLowerCase().includes(query)),
    );

    return results.slice(0, 5);
  };

  // Function to verify file existence
  const verifyFile = async filename => {
    try {
      if (Platform.OS === 'android') {
        // Try to check if the file exists in assets
        try {
          const files = await RNFS.readDirAssets('');
          const fileExists = files.some(
            file => file.name === filename || file.path.includes(filename),
          );
          console.log(`File ${filename} exists in assets: ${fileExists}`);
          return fileExists;
        } catch (e) {
          console.log(`Error checking assets: ${e.message}`);
          // Try direct path
          const filePath = `file:///android_asset/${filename}`;
          const exists = await RNFS.exists(filePath);
          console.log(`File ${filename} exists at ${filePath}: ${exists}`);
          return exists;
        }
      } else {
        // iOS
        const filePath = `${RNFS.MainBundlePath}/${filename}`;
        const exists = await RNFS.exists(filePath);
        console.log(`File ${filename} exists at ${filePath}: ${exists}`);
        return exists;
      }
    } catch (e) {
      console.log(`Error verifying file ${filename}: ${e.message}`);
      return false;
    }
  };

  // Check all files on component mount
  useEffect(() => {
    const checkFiles = async () => {
      console.log('Checking files...');
      for (const layer of tiffLayers) {
        const tiffExists = await verifyFile(layer.filename);
        const csvExists = await verifyFile(layer.csvFilename);
        console.log(
          `${layer.name}: TIFF ${tiffExists ? 'Found' : 'Not found'}, CSV ${
            csvExists ? 'Found' : 'Not found'
          }`,
        );
      }
    };

    if (webViewLoaded) {
      checkFiles();
    }
  }, [webViewLoaded]);

  // Unified color scale for all pollution layers
  const getUnifiedColorScale = () => `
   if (value < 0.2) return 'rgba(0, 255, 0, 0.7)';      // green (low)
   else if (value < 0.4) return 'rgba(255, 255, 0, 0.7)'; // yellow (medium-low)
   else if (value < 0.6) return 'rgba(255, 165, 0, 0.7)'; // orange (medium)
   else if (value < 0.8) return 'rgba(255, 0, 0, 0.7)';   // red (medium-high)
   else return 'rgba(128, 0, 128, 0.7)';                  // purple (high)
 `;

  // Function to load and parse CSV data
  const loadCSVData = async layer => {
    if (!layer) return;

    try {
      setCsvLoading(true);
      setStatus(`Loading ${layer.name} data points...`);

      // Get the CSV filename
      const csvFilename = layer.csvFilename;

      let csvData;

      if (Platform.OS === 'android') {
        try {
          // Try to copy from assets to cache directory first
          const destPath = `${RNFS.CachesDirectoryPath}/${csvFilename}`;
          await RNFS.copyFileAssets(csvFilename, destPath);
          csvData = await RNFS.readFile(destPath, 'utf8');
        } catch (copyError) {
          console.error('Error copying CSV file:', copyError);

          // Fallback to direct asset access
          const filePath = `file:///android_asset/${csvFilename}`;
          csvData = await RNFS.readFile(filePath, 'utf8');
        }
      } else {
        // iOS path
        const filePath = `${RNFS.MainBundlePath}/${csvFilename}`;
        csvData = await RNFS.readFile(filePath, 'utf8');
      }

      console.log(`CSV data loaded, length: ${csvData.length}`);

      // Parse CSV data
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          // Assuming CSV has X, Y, Value columns
          const parsedMarkers = results.data
            .filter(row => row.X && row.Y && row.Value)
            .map(row => ({
              lat: parseFloat(row.Y),
              lon: parseFloat(row.X),
              value: parseFloat(row.Value),
              type: layer.name,
            }));

          console.log(`Parsed ${parsedMarkers.length} CSV data points`);
          setCsvMarkers(parsedMarkers);

          // Add markers to the map through WebView
          if (webViewRef.current && webViewLoaded) {
            const markersScript = `
              try {
                // Clear existing CSV markers
                clearCSVMarkers();
                
                // Add new markers from CSV data
                const csvPoints = ${JSON.stringify(parsedMarkers)};
                addCSVMarkers(csvPoints);
                true;
              } catch(e) {
                debug("Error adding CSV markers: " + e.message);
                true;
              }
            `;
            webViewRef.current.injectJavaScript(markersScript);
          }

          setStatus(
            `Loaded ${parsedMarkers.length} data points for ${layer.name}`,
          );
        },
        error: error => {
          console.error('CSV parsing error:', error);
          setStatus(`Error parsing CSV: ${error.message}`);
        },
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setStatus(`Error loading CSV data: ${error.message}`);
    } finally {
      setCsvLoading(false);
    }
  };

  // Function to load and display a TIFF file
  const loadTiffFile = async layer => {
    const filename = layer.filename;
    try {
      console.log(`Starting to load TIFF: ${filename}`);
      setTiffLoading(true);
      setStatus(`Loading ${layer.name}...`);
      setCurrentLayer(layer);

      // Define path to the TIFF file based on platform
      let filePath;
      let base64Data;

      if (Platform.OS === 'android') {
        // For Android, first copy from assets to cache directory
        const destPath = `${RNFS.CachesDirectoryPath}/${filename}`;
        console.log(`Copying from assets to: ${destPath}`);

        try {
          await RNFS.copyFileAssets(filename, destPath);
          console.log(`File copied successfully to: ${destPath}`);

          // Check if file exists in destination
          const fileExists = await RNFS.exists(destPath);
          if (!fileExists) {
            throw new Error(`Copied file not found at: ${destPath}`);
          }

          // Read the copied file
          base64Data = await RNFS.readFile(destPath, 'base64');
        } catch (copyError) {
          console.error('Error copying file:', copyError);

          // Fallback to direct asset access
          filePath = `file:///android_asset/${filename}`;
          console.log(`Fallback to direct asset access: ${filePath}`);

          const fileExists = await RNFS.exists(filePath);
          if (!fileExists) {
            throw new Error(`File not found: ${filePath}`);
          }

          base64Data = await RNFS.readFile(filePath, 'base64');
        }
      } else {
        // iOS path
        filePath = `${RNFS.MainBundlePath}/${filename}`;
        console.log(`iOS file path: ${filePath}`);

        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
          throw new Error(`File not found: ${filePath}`);
        }

        base64Data = await RNFS.readFile(filePath, 'base64');
      }

      console.log(`File read as base64, length: ${base64Data.length}`);

      if (!webViewRef.current || !webViewLoaded) {
        throw new Error('WebView is not ready');
      }

      // Use unified color scale for all layers
      const colorScaleCode = getUnifiedColorScale();

      // Inject script to load the base64 data
      const script = `
       try {
         console.log("WebView: Loading GeoTIFF from base64 data");
         
         const loadGeoTiffFromBase64 = async (base64Data) => {
           try {
             debug("Parsing base64 TIFF data");
             
             // Convert base64 to array buffer
             const binaryString = window.atob(base64Data);
             const bytes = new Uint8Array(binaryString.length);
             for (let i = 0; i < binaryString.length; i++) {
               bytes[i] = binaryString.charCodeAt(i);
             }
             const arrayBuffer = bytes.buffer;
             
             debug("Base64 converted to array buffer, size: " + arrayBuffer.byteLength + " bytes");
             
             // Parse GeoTIFF
             debug("Starting GeoTIFF parsing...");
             const georaster = await parseGeoraster(arrayBuffer);
             debug("TIFF parsed successfully");
             
             // Remove existing layer if present
             if (tiffLayer) {
               map.removeLayer(tiffLayer);
               debug("Removed existing TIFF layer");
             }
             
             // Create color scale for visualization
             const colorScale = function(value) {
               if (value === null || isNaN(value)) return null;
               
               // Unified color scale for all layers
               ${colorScaleCode}
             };
             
             debug("Creating GeoRaster layer");
             // Create and add the layer
             tiffLayer = new GeoRasterLayer({
               georaster: georaster,
               opacity: 0.7,
               pixelValuesToColorFn: function(values) {
                 const value = values[0];
                 if (value === null || isNaN(value)) return null;
                 
                 const minValue = georaster.mins[0];
                 const maxValue = georaster.maxs[0];
                 const scaledValue = (value - minValue) / (maxValue - minValue);
                 return colorScale(scaledValue);
               }
             });
             
             tiffLayer.addTo(map);
             debug("TIFF layer added to map");
             
             // Fit bounds
             try {
               const bounds = tiffLayer.getBounds();
               map.fitBounds(bounds);
               debug("Map fitted to TIFF bounds");
             } catch(e) {
               debug("Could not fit to bounds: " + e.message);
             }
             
             debug("TIFF loaded successfully");
           } catch(error) {
             debug("Error loading TIFF: " + error.message);
           }
         };
         
         // Execute the load function with the base64 data
         loadGeoTiffFromBase64("${base64Data}");
       } catch(e) {
         debug("Error in script: " + e.message);
       }
       true;
     `;

      webViewRef.current.injectJavaScript(script);

      // Load the corresponding CSV data after TIFF is loaded
      await loadCSVData(layer);
    } catch (error) {
      console.error('React Native error loading TIFF:', error);
      setStatus(`Error loading TIFF: ${error.message}`);
      Alert.alert('Error', `Failed to load ${layer.name}: ${error.message}`);
    } finally {
      setTiffLoading(false);
    }
  };

  // Function to show current location information
  const showCurrentLocation = () => {
    if (webViewRef.current && webViewLoaded) {
      const script = `
       showCurrentLocation();
       true;
     `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Functions to handle zoom
  const handleZoomIn = () => {
    if (webViewRef.current && webViewLoaded) {
      const script = `
       zoomMap('in');
       true;
     `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  const handleZoomOut = () => {
    if (webViewRef.current && webViewLoaded) {
      const script = `
       zoomMap('out');
       true;
     `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Handler for when a location is selected from search
  const handleLocationSelect = location => {
    // Close any open dropdowns
    setShowDropdown(false);

    if (webViewRef.current && webViewLoaded) {
      const script = `
     goToLocation(
       ${location.lat}, 
       ${location.lon}, 
       "${location.name.replace(/"/g, '\\"')}", 
       "${
         location.description
           ? location.description.replace(/"/g, '\\"')
           : 'Selected location'
       }"
     );
     true;
   `;
      webViewRef.current.injectJavaScript(script);
      setStatus(`Navigated to ${location.name}`);
    }
  };

  // Function to handle marker click
  const handleMarkerClick = marker => {
    setSelectedMarkerData(marker);
    setShowPollutionCard(true);
  };

  // Handle messages from WebView
  const handleWebViewMessage = event => {
    console.log('WebView message:', event.nativeEvent.data);

    // Try to parse as JSON
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Handle CSV marker clicks
      if (data.type === 'csvMarkerClick') {
        const markerData = data.data;
        setSelectedMarkerData({
          id: `${markerData.lat}-${markerData.lon}`,
          value: markerData.value.toFixed(2),
          source: 'CSV Data',
          location: `Lat: ${markerData.lat.toFixed(
            5,
          )}, Lon: ${markerData.lon.toFixed(5)}`,
          type: markerData.markerType,
          status: getStatusFromValue(markerData.value),
        });
        setShowPollutionCard(true);
      }
      // Process search-related messages
      else if (data.type === 'searchResults') {
        // Handle search results
        setSearchResults(data.results || []);
        if (data.results && data.results.length > 0) {
          setShowDropdown(true);
          setStatus(`Found ${data.results.length} locations`);
        } else {
          setShowDropdown(false);
          setStatus('No locations found');
        }
      } else if (data.type === 'localSearch') {
        // Perform local search
        const results = performLocalSearch(data.query);
        if (results.length > 0) {
          setSearchResults(results);
          setShowDropdown(true);
          setStatus(`Found ${results.length} local locations`);
        }
      } else if (data.type === 'searchError') {
        console.warn('Search error:', data.error);
        // Try local search as fallback
        if (data.query) {
          const results = performLocalSearch(data.query);
          if (results.length > 0) {
            setSearchResults(results);
            setShowDropdown(true);
            setStatus(`Found ${results.length} local locations`);
          } else {
            setShowDropdown(false);
            setStatus('No locations found');
          }
        }
      }
    } catch (e) {
      // Not JSON data, handle as regular message
      // Update status when needed
      if (!event.nativeEvent.data.includes('Error')) {
        // Don't show errors to the user
        setStatus(event.nativeEvent.data);
      } else {
        console.warn('WebView error:', event.nativeEvent.data);
      }
    }
  };

  // Touch handler to close dropdown if user taps outside
  const handleOutsideTouch = () => {
    if (showPollutantDropdown) {
      setShowPollutantDropdown(false);
    }
    if (showPollutionCard) {
      setShowPollutionCard(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map View - Full Screen */}
      <View style={styles.mapCardContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.mapTouchable}
          onPress={() => {
            if (showDropdown) {
              setShowDropdown(false);
            }
            if (showPollutantDropdown) {
              setShowPollutantDropdown(false);
            }
            if (showPollutionCard) {
              setShowPollutionCard(false);
            }
            Keyboard.dismiss();
          }}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: htmlContent}}
            onMessage={handleWebViewMessage}
            onLoad={() => {
              setWebViewLoaded(true);
              setStatus('Map loaded');
              showCurrentLocation();
            }}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              setStatus(`WebView error: ${nativeEvent.description}`);
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
              </View>
            )}
            // All the WebView props remain the same
            containerStyle={{flex: 1}}
            nestedScrollEnabled={true}
            scalesPageToFit={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            directionalLockEnabled={false}
            androidLayerType="hardware"
            scrollEnabled={true}
            bounces={false}
            allowFileAccess={true}
            useWebKit={true}
            cacheEnabled={true}
            javaScriptEnabledAndroid={true}
            geolocationEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            allowsBackForwardNavigationGestures={false}
            injectedJavaScript={`
            if (map) {
              map.invalidateSize();
              debug("Map size invalidated to ensure proper rendering");
            }
            true;
          `}
          />
        </TouchableOpacity>

        {/* Search Component */}
        <View style={styles.header}>
          <SearchBox
            webViewRef={webViewRef}
            webViewLoaded={webViewLoaded}
            allLocations={allLocations}
            setStatus={setStatus}
            onLocationSelect={handleLocationSelect}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        </View>

        {/* Zoom Controls - Moved to bottom right */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
        </View>

        {/* Static marker yellow circles with touch functionality - Now only shown if no CSV data */}
        {webViewLoaded && csvMarkers.length === 0 && (
          <>
            <TouchableOpacity
              style={[styles.pollutantMarker, {top: '45%', left: '50%'}]}
              onPress={() =>
                handleMarkerClick({
                  id: 1,
                  value: 105,
                  source: 'WWF-Pakistan',
                  location: 'Lahore',
                  type: 'Particulate Matter (PM2.5)',
                  status: 'Moderate',
                })
              }>
              <Text style={styles.pollutantMarkerText}>105</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pollutantMarker, {top: '25%', left: '30%'}]}
              onPress={() =>
                handleMarkerClick({
                  id: 2,
                  value: 125,
                  source: 'WWF-Pakistan',
                  location: 'Lahore',
                  type: 'Particulate Matter (PM2.5)',
                  status: 'Moderate',
                })
              }>
              <Text style={styles.pollutantMarkerText}>125</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Pollution Information Card - Only shows when a marker is clicked */}
        {showPollutionCard && selectedMarkerData && (
          <View style={styles.pollutionInfoCardContainer}>
            <View style={styles.pollutionInfoCard}>
              <Text style={styles.pollutionInfoSource}>
                {selectedMarkerData.source}, {selectedMarkerData.location}
              </Text>
              <Text style={styles.pollutionInfoType}>
                {selectedMarkerData.type}
              </Text>
              <Text style={styles.pollutionInfoValue}>
                {selectedMarkerData.value}
              </Text>
              <View style={styles.pollutionInfoStatus}>
                <Text style={styles.pollutionInfoStatusText}>
                  {selectedMarkerData.status}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* AQI Indicator */}
        <View style={styles.aqiIndicator}>
          <Text style={styles.aqiText}>AQI</Text>
          <Text style={styles.aqiValue}>
            {currentLayer ? currentLayer.name.split(' ')[0] : 'PM2.5'}
          </Text>
        </View>

        {/* Pollutant Selection Button */}
        <TouchableOpacity
          style={styles.pollutantButton}
          onPress={() => setShowPollutantDropdown(!showPollutantDropdown)}>
          <Text style={styles.pollutantButtonText}>
            {currentLayer ? currentLayer.name : 'Select Pollutant'}
          </Text>
        </TouchableOpacity>

        {/* Loading Overlay */}
        {(tiffLoading || csvLoading) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>
              {csvLoading
                ? 'Loading pollution data points...'
                : 'Loading pollution layer...'}
            </Text>
          </View>
        )}

        {/* Pollutant Layers Dropdown */}
        {showPollutantDropdown && (
          <View style={styles.pollutantDropdown}>
            <ScrollView>
              {tiffLayers.map((layer, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pollutantDropdownItem}
                  onPress={() => {
                    loadTiffFile(layer);
                    setShowPollutantDropdown(false);
                  }}>
                  <Text style={styles.pollutantDropdownText}>{layer.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Touch handler to close dropdowns when clicking outside */}
        {(showPollutantDropdown || showPollutionCard) && (
          <TouchableOpacity
            style={styles.touchableOverlay}
            activeOpacity={0}
            onPress={handleOutsideTouch}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  mapCardContainer: {
    flex: 1,
  },
  mapTouchable: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    right: 15,
    bottom: 80,
    zIndex: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pollutantMarker: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 5,
  },
  pollutantMarkerText: {
    color: 'black',
    fontWeight: 'bold',
  },
  pollutionInfoCardContainer: {
    position: 'absolute',
    top: '35%', // Center vertically
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pollutionInfoCard: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  pollutionInfoSource: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  pollutionInfoType: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  pollutionInfoValue: {
    color: '#FFD700', // Gold color for the value
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pollutionInfoStatus: {
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  pollutionInfoStatusText: {
    color: 'black',
    fontWeight: 'bold',
  },
  aqiIndicator: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#4CAF50', // Green for good AQI
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  aqiText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  aqiValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 15,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  pollutantButton: {
    position: 'absolute',
    top: 80,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 8, // Lowered from 10 to be below the search dropdown
  },
  pollutantButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pollutantDropdown: {
    position: 'absolute',
    top: 120,
    right: 15,
    width: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 5,
    maxHeight: 250,
    zIndex: 10,
  },
  pollutantDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pollutantDropdownText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LahoreMap;
