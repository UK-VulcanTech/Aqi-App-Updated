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
  // Keyboard,
  Image,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import SearchBox from './SearchBox';
import Papa from 'papaparse';
import {useGetAllSensors} from '../../services/sensor.hooks';
// import {SafeAreaView} from 'react-native-safe-area-context';

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
  // const [selectedAqiTab, setSelectedAqiTab] = useState('AQI');
  const {data: sensorData} = useGetAllSensors();
  console.log('🚀 ~ LahoreMap ~ sensorData:', sensorData);

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

  // Helper function to determine status based on value
  const getStatusFromValue = value => {
    if (value < 0.2) {
      return 'Good';
    } else if (value < 0.4) {
      return 'Moderate';
    } else if (value < 0.6) {
      return 'Unhealthy for Sensitive Groups';
    } else if (value < 0.8) {
      return 'Unhealthy';
    } else {
      return 'Hazardous';
    }
  };

  // Initial HTML with Leaflet map - FIXED for dragging and zooming
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
      }
      #map { 
        position: absolute; 
        top: 0; 
        bottom: 0; 
        width: 100%; 
        height: 100%;
      }
      .leaflet-marker-icon,
      .leaflet-marker-shadow,
      .leaflet-image-layer,
      .leaflet-pane > svg path {
        pointer-events: auto !important;
      }
      .leaflet-popup {
        display: none !important;
      }
      .leaflet-control {
        background: transparent !important;
      }
      .leaflet-bar {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
      .leaflet-bar a {
        background: rgba(0, 0, 0, 0.7) !important;
        color: white !important;
        border: none !important;
      }
      .leaflet-control-attribution {
        background: rgba(0, 0, 0, 0.5) !important;
        color: #aaa !important;
      }
      .custom-div-icon {
        background: transparent;
        border: none;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // VERY SIMPLIFIED APPROACH - minimizing layers of complexity
      
      // Force touch detection
      L.Browser.touch = true;
      L.Browser.mobile = true;
      
      // Simple map initialization with minimal options
      var map = L.map('map', {
        zoomControl: false,
        attributionControl: true,
        dragging: true,
        touchZoom: true,
        minZoom: 10,
        maxZoom: 18
      }).setView([31.5204, 74.3587], 11);
      
      // Define Lahore bounds
      const lahoreBounds = L.latLngBounds(
        L.latLng(31.40, 74.15),
        L.latLng(31.65, 74.45)
      );
      
      map.setMaxBounds(lahoreBounds);
      
      // Add base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      var tiffLayer = null;
      var markers = [];
      var csvMarkers = [];
      var currentInfoBox = null;
      
      // Debug function
      function debug(message) {
        window.ReactNativeWebView.postMessage(message);
      }

      // Zoom function with direct implementation
      function zoomMap(direction) {
        try {
          let zoom = map.getZoom();
          debug("Current zoom level: " + zoom);
          
          if (direction === 'in' && zoom < 18) {
            map.setZoom(zoom + 1);
            debug("Zoomed in to: " + map.getZoom());
          } 
          else if (direction === 'out' && zoom > 10) {
            map.setZoom(zoom - 1);
            debug("Zoomed out to: " + map.getZoom());
          }
          else if (direction === 'out') {
            map.fitBounds(lahoreBounds);
            debug("Reset to Lahore bounds");
          }
        } catch(e) {
          debug("Zoom error: " + e.message);
        }
      }
      
      // Location search
      function searchLocation(query) {
        debug("Searching for: " + query);
        
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query + ' lahore pakistan'), {
          headers: {
            'User-Agent': 'LahoreMapApp/1.0'
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              const results = data
                .filter(item => {
                  const lat = parseFloat(item.lat);
                  const lon = parseFloat(item.lon);
                  return lat >= 31.40 && lat <= 31.65 && lon >= 74.15 && lon <= 74.45;
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
      
      // Go to location
      function goToLocation(lat, lon, title, description) {
        const latlng = L.latLng(lat, lon);
        if (!lahoreBounds.contains(latlng)) {
          debug("Location outside Lahore: " + title);
          lat = 31.5204;
          lon = 74.3587;
          title = "Lahore";
          description = "City in Pakistan";
        }
        
        map.setView([lat, lon], 13);
        addMarker(lat, lon, title, description);
        debug("Moved to location: " + title);
      }
      
      // Rest of your functions (keeping them simple)
      function addMarker(lat, lon, title, description) {
        clearSearchMarkers();
        
        const marker = L.marker([lat, lon]).addTo(map);
        
        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerClick',
            data: {
              lat: lat,
              lon: lon,
              title: title,
              description: description
            }
          }));
        });
        
        markers.push(marker);
        return marker;
      }
      
      function clearSearchMarkers() {
        markers.forEach(marker => {
          map.removeLayer(marker);
        });
        markers = [];
      }
      
      function clearAllMarkers() {
        markers.forEach(marker => {
          map.removeLayer(marker);
        });
        markers = [];
      }

      function clearCSVMarkers() {
        csvMarkers.forEach(marker => {
          map.removeLayer(marker);
        });
        csvMarkers = [];
        debug("Cleared CSV markers");
      }

      function addCSVMarkers(points) {
        debug("Adding " + points.length + " invisible CSV markers");
        
        points.forEach(point => {
          const circleMarker = L.circleMarker([point.lat, point.lon], {
            radius: 15,
            fillColor: getValueColor(point.value),
            color: '#fff',
            weight: 0,
            opacity: 0,
            fillOpacity: 0
          }).addTo(map);
          
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

      function getValueColor(value) {
        if (value < 0.2) return '#8BC83B';
        else if (value < 0.4) return '#EEC732';
        else if (value < 0.6) return '#EA8C34';
        else if (value < 0.8) return '#FF0000';
        else return '#A97EBC';
      }
      
      function showCurrentLocation() {
        const center = map.getCenter();
        const zoom = map.getZoom();
        
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
      
      // Let WebView know the map is ready
      map.on('load', function() {
        debug("Map fully loaded");
      });
      
      debug("Map initialized");
    </script>
  </body>
  </html>
`;

  // Add this function near the top of your component
  const getColorForAQI = aqi => {
    if (aqi <= 50) {
      return {
        textColor: '#506E29',
        bgColor: '#8BC83B',
        status: 'Good',
      };
    }
    if (aqi <= 100) {
      return {
        textColor: '#796009',
        bgColor: '#EEC732',
        status: 'Moderate',
      };
    }
    if (aqi <= 150) {
      return {
        textColor: '#894215',
        bgColor: '#EA8C34',
        status: 'Poor',
      };
    }
    if (aqi <= 200) {
      return {
        textColor: '#78191A',
        bgColor: '#A45152',
        status: 'Unhealthy',
      };
    }
    if (aqi <= 250) {
      return {
        textColor: '#67327E',
        bgColor: '#A97EBC',
        status: 'Very unhealthy',
      };
    }
    if (aqi > 250) {
      return {
        textColor: '#740814',
        bgColor: '#C92033',
        status: 'Hazardous',
      };
    }
  };

  // Add this sample data near the top of your component
  const pollutantsData = [
    {pollutant: 'PM2.5', value: 35, unit: 'μg/m³'},
    {pollutant: 'PM10', value: 283.81, unit: 'μg/m³'},
    {pollutant: 'CO', value: 4.513, unit: 'μg/m³'},
    {pollutant: 'O₃', value: 18.977, unit: 'ppb'},
    {pollutant: 'NO₂', value: 107.81, unit: 'ppb'},
    {pollutant: 'SO₂', value: 6.005, unit: 'ppb'},
  ];

  // Function to show Lahore-only notification
  const showLahoreOnlyNotification = () => {
    setStatus('Only Lahore locations are available');
    setTimeout(() => {
      setStatus('Ready');
    }, 3000);
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
   if (value < 0.2) return '#8BC83B';      // green (low)
   else if (value < 0.4) return '#EEC732'; // yellow (medium-low)
   else if (value < 0.6) return '#EA8C34'; // orange (medium)
   else if (value < 0.8) return '#C92033';   // red (medium-high)
   else return '#A97EBC';                  // purple (high)
 `;

  // Function to load and parse CSV data
  const loadCSVData = async layer => {
    if (!layer) {
      return;
    }

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

          // Add markers to the map through WebView - now as invisible markers
          if (webViewRef.current && webViewLoaded) {
            const markersScript = `
              try {
                // Clear existing CSV markers
                clearCSVMarkers();
                
                // Add new markers from CSV data - these will be invisible
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

      // FIXED: Improved script to load the base64 data with better zoom behavior
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
             
             // FIXED: Improved fit bounds functionality to ensure entire TIFF layer is visible
             try {
               const bounds = tiffLayer.getBounds();
               // Check if bounds are within Lahore bounds
               const layerBounds = bounds && bounds.isValid() ? bounds : lahoreBounds;
               
               // Ensure we don't go outside Lahore bounds
               const fitBounds = L.latLngBounds(
                 [
                   Math.max(layerBounds.getSouth(), lahoreBounds.getSouth()),
                   Math.max(layerBounds.getWest(), lahoreBounds.getWest())
                 ],
                 [
                   Math.min(layerBounds.getNorth(), lahoreBounds.getNorth()),
                   Math.min(layerBounds.getEast(), lahoreBounds.getEast())
                 ]
               );
               
               if (fitBounds.isValid()) {
                 map.fitBounds(fitBounds);
                 debug("Map view set to fit TIFF within Lahore bounds");
               } else {
                 throw new Error("Invalid fit bounds");
               }
             } catch(e) {
               debug("Could not fit to bounds: " + e.message);
               map.fitBounds(lahoreBounds);
             }
             
             // Re-enable interactions after loading TIFF
             enableMapInteractions();
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

  // Functions to handle zoom - FIXED to respect min/max zoom levels
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
    // Check if location is in Lahore
    if (!location.name.toLowerCase().includes('lahore')) {
      showLahoreOnlyNotification();
      location = {
        name: 'Lahore',
        lat: 31.5204,
        lon: 74.3587,
        description: 'City in Pakistan',
      };
    }

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

      // Handle marker clicks from search
      if (data.type === 'markerClick') {
        const markerData = data.data;

        // FIXED: Set card data with proper location info and color information
        setSelectedMarkerData({
          id: `${markerData.lat}-${markerData.lon}`,
          value: markerData.value || 'N/A',
          source: markerData.source || 'Search Result',
          location:
            markerData.title ||
            `Location at ${markerData.lat.toFixed(4)}, ${markerData.lon.toFixed(
              4,
            )}`,
          type: markerData.description,
          status: markerData.status || 'Location Info',
          color: markerData.color || null, // Store color for styling the card
        });
        setShowPollutionCard(true);
      }
      // Handle CSV marker clicks
      else if (data.type === 'csvMarkerClick') {
        const markerData = data.data;

        // Determine appropriate color based on value
        let color = '#8BC83B'; // Default green
        let status = 'Good';
        const value = markerData.value;

        if (value < 0.2) {
          color = '#8BC83B'; // Green
          status = 'Good';
        } else if (value < 0.4) {
          color = '#EEC732'; // Yellow
          status = 'Moderate';
        } else if (value < 0.6) {
          color = '#EA8C34'; // Orange
          status = 'Unhealthy for Sensitive Groups';
        } else if (value < 0.8) {
          color = '#FF0000'; // Red
          status = 'Unhealthy';
        } else {
          color = '#A97EBC'; // Purple
          status = 'Hazardous';
        }

        // FIXED: Include exact location and color in marker data
        setSelectedMarkerData({
          id: `${markerData.lat}-${markerData.lon}`,
          value: markerData.value.toFixed(2),
          source: 'CSV Data',
          location: `Location at ${markerData.lat.toFixed(
            5,
          )}, ${markerData.lon.toFixed(5)}`,
          type: markerData.markerType,
          status: status,
          color: color,
        });
        setShowPollutionCard(true);
      }
      // Process search-related messages
      else if (data.type === 'searchResults') {
        // Filter to only include Lahore results and remove generic "Lahore" entry
        const lahoreResults = data.results
          ? data.results.filter(item => {
              // Include item if it has Lahore in the name but is not just "Lahore"
              return item.name.toLowerCase().includes('lahore');
            })
          : [];

        setSearchResults(lahoreResults);
        if (lahoreResults.length > 0) {
          setShowDropdown(true);
          setStatus(`Found ${lahoreResults.length} locations in Lahore`);
        } else {
          setShowDropdown(false);
          setStatus('No locations found in Lahore');
        }
      } else if (data.type === 'searchError') {
        console.warn('Search error:', data.error);
        setStatus('Error searching: ' + data.error);
        setShowDropdown(false);
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

  // Function to select a pollutant type from AQI indicator
  const handlePollutantSelect = () => {
    setShowPollutantDropdown(!showPollutantDropdown);
  };

  // Function to go to current location (centered on Lahore) - IMPROVED
  const goToCurrentLocation = () => {
    if (webViewRef.current && webViewLoaded) {
      const script = `
      // Always reset to Lahore bounds
      map.fitBounds(lahoreBounds);
      map.setMaxBounds(lahoreBounds);
      enableMapInteractions();
      debug("Reset to Lahore boundaries");
      true;
    `;
      webViewRef.current.injectJavaScript(script);
      setStatus('Returned to Lahore center');
    }
  };

  // Function to periodically force enable map dragging and enforce Lahore boundaries
  useEffect(() => {
    if (webViewLoaded && webViewRef.current) {
      const interval = setInterval(() => {
        webViewRef.current.injectJavaScript(`
        if (map) {
          enableMapInteractions();
          
          // ADDED: Periodic check to ensure we stay within Lahore bounds
          if (!lahoreBounds.contains(map.getBounds())) {
            map.fitBounds(lahoreBounds);
            debug("Enforcing Lahore bounds");
          }
        }
        true;
      `);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [webViewLoaded]);

  // Use an effect to process sensor data when it loads
  useEffect(() => {
    if (sensorData && webViewLoaded && webViewRef.current) {
      console.log('Processing sensor data:', sensorData.length);
      processSensorData(sensorData);
    }
  }, [sensorData, webViewLoaded]);

  // FIXED: Enhanced function to process and display sensor data on the map
  const processSensorData = sensors => {
    if (!sensors || !webViewRef.current) {
      return;
    }

    try {
      // Format sensor data for the map
      const formattedSensors = sensors
        .filter(sensor => sensor.latitude && sensor.longitude)
        .map(sensor => ({
          lat: sensor.latitude,
          lon: sensor.longitude,
          value: sensor.sensor_value || 0,
          type: 'PM2.5',
          name:
            sensor.location ||
            `Location at ${sensor.latitude.toFixed(
              4,
            )}, ${sensor.longitude.toFixed(4)}`,
          timestamp: sensor.timestamp,
        }));

      console.log(
        `Processing ${formattedSensors.length} sensor readings from Barki`,
      );

      if (formattedSensors.length === 0) {
        console.log('No valid sensor data found');
        return;
      }

      // Inject JavaScript to add colored circles for sensors based on value
      const script = `
    try {
      // Create array for sensor markers if it doesn't exist
      if (!window.sensorMarkers) {
        window.sensorMarkers = [];
      }
      
      // Clear previous sensor markers
      if (window.sensorMarkers && window.sensorMarkers.length) {
        window.sensorMarkers.forEach(marker => {
          map.removeLayer(marker);
        });
        window.sensorMarkers = [];
        debug("Cleared existing sensor markers");
      }
      
      // Add sensor markers with colored circles based on value
      const sensorData = ${JSON.stringify(formattedSensors)};
      debug("Adding " + sensorData.length + " sensor markers");
      
      sensorData.forEach((sensor, index) => {
        // Format the value - round to nearest integer
        const valueDisplay = Math.round(parseFloat(sensor.value)).toString();
        const value = parseFloat(sensor.value);
        
        // Determine background color and status based on value ranges
        let bgColor = '#96CF49'; // Green for 0-50
        let statusText = "Good";
        
        if (value > 250) {
        bgColor = '#FF4D4D'; // Lighter Red for > 250
        statusText = "Hazardous";
        } else if (value > 150) {
        bgColor = '#B782C9'; // Purple for 150-250
        statusText = "Unhealthy";
        } else if (value > 100) {
        bgColor = '#F1913A'; // Orange for 100-150
        statusText = "Unhealthy for Sensitive Groups";
        } else if (value > 50) {
        bgColor = '#FFD633'; // Yellow for 50-150
        statusText = "Moderate";
        }
        
       const customIcon = L.divIcon({
       className: 'custom-div-icon',
       html: "<div style='position:relative;'>" +
        "<div style='background-color:" + bgColor + ";color:white;border-radius:50%;width:40px;height:40px;display:flex;justify-content:center;align-items:center;font-weight:bold;'>" + valueDisplay + "</div>" +
        "</div>",
      iconSize: [40, 40]
      });

        
        // Create marker with the custom icon
        const marker = L.marker([sensor.lat, sensor.lon], {
          icon: customIcon
        }).addTo(map);
        
        // Add a click handler that sends comprehensive data
        marker.on('click', function(e) {
          debug("Sensor marker clicked: " + index);
          
          // FIXED: Send comprehensive data including location and color
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerClick',
            data: {
              lat: sensor.lat,
              lon: sensor.lon,
              title: sensor.name || "Sensor Location",
              description: 'Particulate Matter (PM2.5)',
              value: valueDisplay,
              status: statusText,
              source: 'Sensor Data',
              color: bgColor
            }
          }));
        });
        
        // Store in our sensor markers array
        window.sensorMarkers.push(marker);
      });
      
      debug("Successfully added " + sensorData.length + " sensor markers with values");
      true;
    } catch(e) {
      debug("Error adding sensor markers: " + e.message);
      true;
    }
    `;

      webViewRef.current.injectJavaScript(script);
      setStatus(`Added ${formattedSensors.length} sensor readings`);
    } catch (error) {
      console.error('Error processing sensor data:', error);
      setStatus('Error processing sensor data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map View - Full Screen */}
      <View style={styles.mapCardContainer}>
        <View style={styles.mapTouchable} pointerEvents="box-none">
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: htmlContent}}
            onMessage={handleWebViewMessage}
            onLoad={() => {
              setWebViewLoaded(true);
              setStatus('Map loaded');
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
                <ActivityIndicator size="large" color="#FFD633" />
              </View>
            )}
            containerStyle={{flex: 1}}
            nestedScrollEnabled={false}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            directionalLockEnabled={false}
            androidLayerType="hardware"
            scrollEnabled={false}
            bounces={false}
            allowFileAccess={true}
            useWebKit={true}
          />
        </View>
        {/* Search Component with transparent background */}
        <View style={styles.header}>
          <SearchBox
            webViewRef={webViewRef}
            webViewLoaded={webViewLoaded}
            setStatus={setStatus}
            onLocationSelect={handleLocationSelect}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            onSearchInteraction={() => setShowPollutionCard(false)} // Add this line
          />
        </View>
        {/* Zoom Controls - Modified with fully transparent background */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
        </View>
        {/* MODIFIED: AQI Indicator - Now touchable to show pollutant dropdown */}
        <TouchableOpacity
          style={styles.aqiIndicator}
          // onPress={handlePollutantSelect}
        >
          {/* <Text style={styles.aqiText}>AQI</Text> */}
          <Text style={styles.aqiValue}>
            {currentLayer ? currentLayer.name.split(' ')[0] : 'PM2.5'}
          </Text>
        </TouchableOpacity>
        {/* Modified: Location Button with functionality */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={goToCurrentLocation}>
          <Image
            source={require('../../assets/icons/current-location.png')}
            style={{width: 34, height: 34}}
          />
        </TouchableOpacity>
        {/* Pollutant Selection Button */}
        {/* <TouchableOpacity
          style={styles.pollutantButton}
          onPress={() => setShowPollutantDropdown(!showPollutantDropdown)}>
          <Text style={styles.pollutantButtonText}>
            {currentLayer ? currentLayer.name : 'Select Pollutant'}
          </Text>
        </TouchableOpacity> */}
        {/* Loading Overlay */}
        {(tiffLoading || csvLoading) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFD633" />
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
        {/* Add this after the Pollutant Selection Button */}
        {currentLayer && (
          <TouchableOpacity
            style={styles.removeLayerButton}
            onPress={() => {
              if (webViewRef.current && webViewLoaded) {
                const script = `
                if (tiffLayer) {
                  map.removeLayer(tiffLayer);
                  tiffLayer = null;
                  debug("Removed TIFF layer");
                }
                clearCSVMarkers();
                true;
              `;
                webViewRef.current.injectJavaScript(script);
                setCurrentLayer(null);
                setCsvMarkers([]);
                setStatus('Layer removed');
              }
            }}>
            <Text style={styles.removeLayerButtonText}>Remove Layer</Text>
          </TouchableOpacity>
        )}
        {/* FIXED: Pollution Info Card - Now uses marker color for styling */}
        {showPollutionCard && selectedMarkerData && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: 20,
              right: 20,
              transform: [{translateY: -180}], // Adjusted to better center the card
              zIndex: 1000,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(40, 40, 40, 0.9)',
                padding: 12, // Reduced padding
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 8,
                borderWidth: 1,
                borderColor:
                  selectedMarkerData.color || 'rgba(255,255,255,0.3)',
              }}>
              <Text
                style={{
                  fontSize: 20, // Reduced font size
                  fontWeight: 'bold',
                  marginBottom: 6, // Reduced margin
                  color: 'white',
                  textShadowColor: 'rgba(0,0,0,0.75)',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 3,
                }}>
                Air Quality
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: selectedMarkerData.color || 'red',
                    fontSize: 18, // Reduced size
                    marginRight: 8,
                  }}>
                  ●
                </Text>
                <Text style={{color: 'white', fontSize: 14, fontWeight: '500'}}>
                  {selectedMarkerData.location}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  marginVertical: 8, // Reduced margin
                }}
              />

              {/* Dynamic PM2.5 value display */}
              <View
                style={{
                  alignItems: 'center',
                  marginVertical: 8, // Reduced margin
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 12,
                  padding: 10, // Reduced padding
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16, // Reduced size
                    fontWeight: '600',
                  }}>
                  {selectedMarkerData.type || 'PM2.5 Level'}
                </Text>

                <Text
                  style={{
                    fontSize: 36, // Reduced size
                    fontWeight: 'bold',
                    color: selectedMarkerData.color || '#FFD633',
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: 2,
                  }}>
                  {selectedMarkerData.value}
                </Text>

                <View
                  style={{
                    backgroundColor:
                      selectedMarkerData.color ||
                      getColorForAQI(parseFloat(selectedMarkerData.value))
                        ?.bgColor,
                    paddingHorizontal: 16, // Reduced padding
                    paddingVertical: 6, // Reduced padding
                    borderRadius: 20,
                    marginTop: 8, // Reduced margin
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 14, // Reduced size
                    }}>
                    {selectedMarkerData.status ||
                      getColorForAQI(parseFloat(selectedMarkerData.value))
                        ?.status}
                  </Text>
                </View>
              </View>

              {/* Pollutants section */}
              <View
                style={{
                  width: '100%',
                  padding: 10, // Reduced padding
                  marginTop: 8, // Reduced margin
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14, // Reduced size
                    fontWeight: 'bold',
                    marginBottom: 6, // Reduced margin
                  }}>
                  Additional Pollutants
                </Text>

                {pollutantsData &&
                  pollutantsData.map((data, index) => {
                    const maxValue = Math.max(
                      ...pollutantsData.map(item => item.value),
                    );
                    const barWidth = (data.value / maxValue) * 100;

                    if (
                      selectedMarkerData.type &&
                      selectedMarkerData.type.includes('PM2.5') &&
                      data.pollutant === 'PM2.5'
                    ) {
                      return null;
                    }

                    return (
                      <View key={data.pollutant} style={{marginBottom: 0}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 11, // Reduced size
                              width: '25%',
                            }}>
                            {data.pollutant}
                          </Text>
                          <View
                            style={{
                              height: 6, // Reduced height
                              width: '50%',
                              backgroundColor: 'rgba(80,80,80,1)',
                              borderRadius: 3,
                              overflow: 'hidden',
                            }}>
                            <View
                              style={{
                                height: '100%',
                                width: `${barWidth}%`,
                                backgroundColor:
                                  getColorForAQI(data.value)?.bgColor ||
                                  '#8BC83B',
                                borderRadius: 3,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 9, // Reduced size
                              width: '25%',
                              textAlign: 'right',
                            }}>
                            {data.value} {data.unit}
                          </Text>
                        </View>

                        {index !== pollutantsData.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              width: '100%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              marginVertical: 8, // Reduced margin
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
              </View>

              {/* Close button */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 15,
                  width: 26, // Reduced size
                  height: 26, // Reduced size
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setShowPollutionCard(false)}>
                <Text
                  style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  // FIXED: Improved mapTouchable style for better touch handling
  mapTouchable: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  // MODIFIED: Location button with transparent background
  locationButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  removeLayerButton: {
    position: 'absolute',
    top: 120,
    right: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 8,
  },
  removeLayerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  mapCardContainer: {
    flex: 1,
    position: 'relative',
  },
  zoomControls: {
    position: 'absolute',
    right: 15,
    bottom: 80,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  // Modified: Fully transparent background for zoom buttons
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pollutionInfoCardContainer: {
    position: 'absolute',
    top: '35%', // Center vertically
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  // Modified: Black background for pollution info card
  pollutionInfoCard: {
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 5,
  },
  pollutionInfoSource: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  // ADDED: New style for location text
  pollutionInfoLocation: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pollutionInfoType: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  pollutionInfoValue: {
    color: '#FFD633', // Gold color for the value
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pollutionInfoStatus: {
    alignSelf: 'center',
    backgroundColor: '#FFD633',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  pollutionInfoStatusText: {
    color: 'black',
    fontWeight: 'bold',
  },
  // MODIFIED: Added styling to make AQI indicator look clickable
  aqiIndicator: {
    position: 'absolute',
    left: 20,
    bottom: 80, // Higher position from bottom
    backgroundColor: 'rgba(76, 175, 80, 0.8)', // Semi-transparent green
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
