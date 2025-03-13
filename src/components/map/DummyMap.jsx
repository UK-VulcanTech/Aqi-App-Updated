import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

const DummyMap = () => {
  const [status, setStatus] = useState('Ready');
  const [tiffLoading, setTiffLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const webViewRef = useRef(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

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
        
        // Function to search for a location
        function searchLocation(query) {
          debug("Searching for: " + query);
          // Use a geocoding service like Nominatim
          fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => {
              if (data && data.length > 0) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'searchResults',
                  results: data.slice(0, 5).map(item => ({
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon)
                  }))
                }));
                debug("Found " + data.length + " locations");
              } else {
                debug("Location not found");
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'searchResults',
                  results: []
                }));
              }
            })
            .catch(error => {
              debug("Error searching: " + error.message);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'searchResults',
                results: []
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
        
        // Function to display information about current view
        function showCurrentLocation() {
          const center = map.getCenter();
          const zoom = map.getZoom();
          
          // Reverse geocode to get location name
          fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + 
                center.lat + '&lon=' + center.lng)
            .then(response => response.json())
            .then(data => {
              if (data && data.display_name) {
                // Create or update info box
                if (currentInfoBox) {
                  map.removeControl(currentInfoBox);
                }
                
                const infoBoxControl = L.Control.extend({
                  options: {
                    position: 'bottomright'
                  },
                  onAdd: function() {
                    const div = L.DomUtil.create('div', 'info-box');
                    div.innerHTML = '<strong>Current Location:</strong><br>' + 
                                   data.display_name + '<br>' +
                                   '<strong>Coordinates:</strong> ' + 
                                   center.lat.toFixed(4) + ', ' + center.lng.toFixed(4) + '<br>' +
                                   '<strong>Zoom Level:</strong> ' + zoom;
                    return div;
                  }
                });
                
                currentInfoBox = new infoBoxControl();
                map.addControl(currentInfoBox);
                
                debug("Current location: " + data.display_name);
              }
            })
            .catch(error => {
              debug("Error getting location info: " + error.message);
            });
        }
        
        // Improved touch handling for map
        map.on('zoomstart', function() {
          debug("Zoom started");
        });
        
        // Listen for map move events
        map.on('moveend', function() {
          debug("Map moved");
          showCurrentLocation();
        });
        
        // Listen for zoom events
        map.on('zoomend', function() {
          debug("Map zoomed to level: " + map.getZoom());
        });
        
        // Initialize with current location info
        showCurrentLocation();
      </script>
    </body>
    </html>
  `;

  // Function to load and display a TIFF file
  const loadTiffFile = async () => {
    const filename = 'NO2_clipped.tif';
    try {
      console.log(`Starting to load TIFF: ${filename}`);
      setTiffLoading(true);
      setStatus(`Loading TIFF: ${filename}...`);

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
                
                // Simple color scale
                if (value < 0.2) return 'rgba(0, 255, 0, 0.7)';      // green
                else if (value < 0.4) return 'rgba(255, 255, 0, 0.7)'; // yellow
                else if (value < 0.6) return 'rgba(255, 165, 0, 0.7)'; // orange
                else if (value < 0.8) return 'rgba(255, 0, 0, 0.7)';   // red
                else return 'rgba(128, 0, 128, 0.7)';                  // purple
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
    } catch (error) {
      console.error('React Native error loading TIFF:', error);
      setStatus(`Error loading TIFF: ${error.message}`);
      Alert.alert('Error', `Failed to load TIFF: ${error.message}`);
    } finally {
      setTiffLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Show we're waiting for results
    setStatus('Searching...');

    if (webViewRef.current && webViewLoaded) {
      const script = `
        searchLocation("${searchQuery.replace(/"/g, '\\"')}");
        true;
      `;
      webViewRef.current.injectJavaScript(script);
      setShowDropdown(true);
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

  // Handle location selection - Fixed to immediately close dropdown
  const handleLocationSelect = location => {
    // First, set states that should change immediately
    setShowDropdown(false);
    setSearchResults([]); // Clear results immediately

    // Dismiss the keyboard
    Keyboard.dismiss();

    // Set the search query text (this won't re-trigger the dropdown because we cleared results)
    setSearchQuery(location.name);

    // Navigate to the location
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

  // Live search as user types - with timeout to prevent excessive API calls
  useEffect(() => {
    let timeoutId;

    if (searchQuery.length >= 3 && webViewRef.current && webViewLoaded) {
      // Set status to show searching
      setStatus('Searching...');

      timeoutId = setTimeout(() => {
        const script = `
          searchLocation("${searchQuery.replace(/"/g, '\\"')}");
          true;
        `;
        webViewRef.current.injectJavaScript(script);
      }, 500); // Debounce for 500ms
    } else if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchQuery, webViewLoaded]);

  // Handle messages from WebView
  const handleWebViewMessage = event => {
    console.log('WebView message:', event.nativeEvent.data);

    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'searchResults') {
        // Handle search results from WebView
        setSearchResults(data.results);

        if (data.results.length === 0) {
          setStatus('No locations found');
          setShowDropdown(false);
        } else {
          setStatus(`Found ${data.results.length} locations`);
          setShowDropdown(true);
        }
      }
    } catch (e) {
      // Not JSON data, handle as regular message
      console.log('Regular message:', event.nativeEvent.data);
    }
  };

  // Touch handler to close dropdown if user taps outside
  const handleOutsideTouch = () => {
    if (showDropdown) {
      setShowDropdown(false);
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>World Map</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.button, tiffLoading && styles.disabledButton]}
            onPress={loadTiffFile}
            disabled={tiffLoading}>
            <Text style={styles.buttonText}>LOAD TIFF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (webViewRef.current) {
                webViewRef.current.reload();
                setStatus('Reloading...');
              }
            }}>
            <Text style={styles.buttonText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.statusText}>{status}</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <View style={styles.searchDropdown}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => handleLocationSelect(result)}>
                <Text style={styles.searchResultText}>{result.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Predefined Locations */}
      <View style={styles.predefinedContainer}>
        <Text style={styles.dropdownLabel}>Quick Select:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {predefinedLocations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.predefinedItem}
              onPress={() => handleLocationSelect(location)}>
              <Text style={styles.predefinedText}>{location.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Touch handler to close dropdown when clicking outside */}
      {showDropdown && (
        <TouchableOpacity
          style={styles.touchableOverlay}
          activeOpacity={0}
          onPress={handleOutsideTouch}
        />
      )}

      <View style={styles.mapCardContainer}>
        <View style={styles.mapCard}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.mapTouchable}
            onPress={handleOutsideTouch}>
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
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
              // Critical WebView settings for proper touch handling
              containerStyle={{flex: 1}}
              nestedScrollEnabled={true}
              scalesPageToFit={false} // Important for iOS
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              directionalLockEnabled={false}
              // Enable required WebView settings for zooming
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
                // Force touch handlers to re-register after WebView loads
                if (map) {
                  map.invalidateSize();
                  debug("Map size invalidated to ensure proper rendering");
                }
                true;
              `}
            />
          </TouchableOpacity>
          {tiffLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading TIFF file...</Text>
            </View>
          )}
        </View>

        {/* Zoom controls in React Native UI */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Current location info button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={showCurrentLocation}>
        <Text style={styles.buttonText}>View Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusText: {
    padding: 10,
    color: '#666',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 4,
    marginLeft: 10,
  },
  searchDropdown: {
    position: 'absolute',
    top: 140, // Adjusted to position below search bar
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    maxHeight: 200,
    zIndex: 10,
    elevation: 5, // For Android
  },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 14,
  },
  predefinedContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  predefinedItem: {
    padding: 8,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  predefinedText: {
    fontSize: 14,
  },
  mapCardContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: 'relative',
  },
  mapCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapTouchable: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
  },
  zoomControls: {
    position: 'absolute',
    right: 25,
    top: 20,
    zIndex: 2,
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DummyMap;
