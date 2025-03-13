import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';

const DummyMap = () => {
  const [status, setStatus] = useState('Loading...');
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [tiffLoading, setTiffLoading] = useState(false);
  const webViewRef = useRef(null);
  const searchTimeout = useRef(null);

  // Fetch suggestions from Nominatim when search text changes
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchText.trim()) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText]);

  // Function to fetch suggestions from Nominatim
  const fetchSuggestions = async query => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'ReactNativeMapApp',
          },
        },
      );
      const data = await response.json();

      const formattedSuggestions = data.map((item, index) => ({
        id: item.place_id.toString() || index.toString(),
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setStatus('Error fetching suggestions: ' + error.message);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Function to handle search
  const handleSearch = (query = searchText, lat = null, lon = null) => {
    if (query.trim() && webViewRef.current) {
      let searchScript;

      if (lat !== null && lon !== null) {
        searchScript = `
          searchLocationByCoordinates(${lat}, ${lon}, "${query.replace(
          /"/g,
          '\\"',
        )}");
          true;
        `;
      } else {
        searchScript = `
          searchLocation("${query.replace(/"/g, '\\"')}");
          true;
        `;
      }

      webViewRef.current.injectJavaScript(searchScript);
      setStatus(`Searching for: ${query}`);
      setShowSuggestions(false);
    }
  };

  // Function to handle suggestion selection
  const handleSelectSuggestion = suggestion => {
    setSearchText(suggestion.name);
    handleSearch(suggestion.name, suggestion.lat, suggestion.lon);
  };

  // Function to load a local TIFF file
  const loadTiffFile = async filename => {
    try {
      console.log(`Starting to load TIFF: ${filename}`);
      setTiffLoading(true);
      setStatus(`Loading TIFF: ${filename}...`);

      // Define path to the TIFF file based on platform
      let filePath;

      if (Platform.OS === 'android') {
        filePath = `file:///android_asset/${filename}`;
      } else {
        filePath = RNFS.MainBundlePath + '/' + filename;
      }

      // Check if file exists
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error(`File not found: ${filePath}`);
      }

      console.log(`File exists at path: ${filePath}`);

      // Read file as base64
      const base64Data = await RNFS.readFile(filePath, 'base64');
      console.log(`File read as base64, length: ${base64Data.length}`);

      if (webViewRef.current) {
        // Inject script to load the base64 data
        const script = `
          try {
            console.log("WebView: Loading GeoTIFF from base64 data");
            
            const loadGeoTiffFromBase64 = async (base64Data) => {
              try {
                window.ReactNativeWebView.postMessage("Parsing base64 TIFF data");
                
                // Convert base64 to array buffer
                const binaryString = window.atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const arrayBuffer = bytes.buffer;
                
                window.ReactNativeWebView.postMessage("Base64 converted to array buffer, size: " + arrayBuffer.byteLength + " bytes");
                
                // Parse GeoTIFF
                const georaster = await parseGeoraster(arrayBuffer);
                window.ReactNativeWebView.postMessage("TIFF parsed successfully");
                
                // Remove existing layer if present
                if (tiffLayer) {
                  map.removeLayer(tiffLayer);
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
                
                // Create and add the layer
                tiffLayer = new GeoRasterLayer({
                  georaster: georaster,
                  opacity: 0.7,
                  pixelValuesToColorFn: function(values) {
                    const value = values[0];
                    const minValue = georaster.mins[0];
                    const maxValue = georaster.maxs[0];
                    const scaledValue = (value - minValue) / (maxValue - minValue);
                    return colorScale(scaledValue);
                  }
                });
                
                tiffLayer.addTo(map);
                
                // Fit bounds
                try {
                  const bounds = tiffLayer.getBounds();
                  map.fitBounds(bounds);
                  debug("Map fitted to TIFF bounds");
                } catch(e) {
                  debug("Could not fit to bounds: " + e.message);
                }
                
                window.ReactNativeWebView.postMessage("TIFF loaded successfully");
              } catch(error) {
                window.ReactNativeWebView.postMessage("Error loading TIFF: " + error.message);
              }
            };
            
            // Execute the load function with the base64 data
            loadGeoTiffFromBase64("${base64Data}");
          } catch(e) {
            window.ReactNativeWebView.postMessage("Error in script: " + e.message);
          }
          true;
        `;

        webViewRef.current.injectJavaScript(script);
      }
    } catch (error) {
      console.error('React Native error loading TIFF:', error);
      setStatus(`Error loading TIFF: ${error.message}`);
    } finally {
      setTiffLoading(false);
    }
  };

  // HTML with Leaflet + GeoRaster libraries
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        
        <!-- Leaflet CSS -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
        
        <!-- Leaflet JavaScript -->
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""></script>
        
        <!-- GeoTIFF dependencies -->
        <script src="https://unpkg.com/chroma-js@2.4.2/chroma.min.js"></script>
        <script src="https://unpkg.com/geotiff@2.0.7/dist-browser/geotiff.js"></script>
        <script src="https://unpkg.com/plotty@0.4.4/dist/plotty.min.js"></script>
        <script src="https://unpkg.com/georaster@1.5.6/dist/georaster.browser.bundle.min.js"></script>
        <script src="https://unpkg.com/georaster-layer-for-leaflet@3.10.0/dist/georaster-layer-for-leaflet.min.js"></script>
          
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            height: 100vh;
            width: 100vw;
          }
          #map { 
            height: 100%; 
            width: 100%;
          }
          #debug {
            position: absolute;
            bottom: 10px;
            left: 10px;
            padding: 5px;
            background-color: rgba(255,255,255,0.8);
            z-index: 1000;
            font-family: monospace;
            font-size: 10px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div id="debug">Loading world map...</div>
        
        <script>
          // Global variables
          let map;
          let searchMarker;
          let tiffLayer;
          
          // Debug utility
          function debug(msg) {
            document.getElementById('debug').textContent = msg;
            try {
              window.ReactNativeWebView.postMessage(msg);
            } catch(e) {
              document.getElementById('debug').textContent += " (Can't post message)";
            }
          }
          
          // Search for a location by name
          async function searchLocation(query) {
            if (!query) return;
            
            try {
              debug("Searching for: " + query);
              
              // Use Nominatim for geocoding (OpenStreetMap's geocoding service)
              const response = await fetch(
                \`https://nominatim.openstreetmap.org/search?format=json&q=\${encodeURIComponent(query)}\`,
                {
                  headers: {
                    'Accept-Language': 'en',
                    'User-Agent': 'ReactNativeMapApp'
                  }
                }
              );
              
              const data = await response.json();
              
              if (data && data.length > 0) {
                const location = data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);
                
                // Set view and add marker
                setLocationOnMap(lat, lon, location.display_name);
                
                debug("Found: " + location.display_name);
              } else {
                debug("Location not found: " + query);
              }
            } catch (error) {
              debug("Search error: " + error.message);
            }
          }
          
          // Search for a location by coordinates
          function searchLocationByCoordinates(lat, lon, displayName) {
            try {
              debug("Setting location: " + displayName);
              
              // Set view and add marker
              setLocationOnMap(lat, lon, displayName);
              
              debug("Showing: " + displayName);
            } catch (error) {
              debug("Error setting location: " + error.message);
            }
          }
          
          // Set location on map (common function for both search methods)
          function setLocationOnMap(lat, lon, displayName) {
            // Center map on found location
            map.setView([lat, lon], 12);
            
            // Add or move marker
            if (searchMarker) {
              searchMarker.setLatLng([lat, lon]);
            } else {
              searchMarker = L.marker([lat, lon]).addTo(map);
            }
            
            // Add popup with location name
            searchMarker.bindPopup(displayName).openPopup();
          }
          
          // Initialize map on load
          document.addEventListener('DOMContentLoaded', function() {
            try {
              debug("Initializing map with Leaflet...");
              
              // Create map centered at Lahore, Pakistan coordinates
              map = L.map('map', {
                center: [31.5497, 74.3436],
                zoom: 11,
                minZoom: 2,
                maxZoom: 18,
                zoomControl: true,
                attributionControl: true
              });
              
              // Add OpenStreetMap tile layer
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: ['a', 'b', 'c']
              }).addTo(map);
              
              // Handle resize events
              window.addEventListener('resize', function() {
                map.invalidateSize();
              });
              
              debug("Map initialized successfully");
            } catch(e) {
              debug("Error initializing map: " + e.message);
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>World Map</Text>
        <View style={styles.headerButtons}>
          <Button
            title="Load TIFF"
            onPress={() => loadTiffFile('NO2_clipped.tif')}
            disabled={tiffLoading}
          />
          <Button
            title="Refresh"
            onPress={() => {
              webViewRef.current?.reload();
              setStatus('Reloading...');
              setShowSuggestions(false);
            }}
          />
        </View>
      </View>

      <Text style={styles.status}>{status}</Text>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setShowSuggestions(true)}
            onSubmitEditing={() => handleSearch()}
          />
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              {isLoadingSuggestions ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color="#0078D7" />
                  <Text style={styles.loaderText}>Loading suggestions...</Text>
                </View>
              ) : suggestions.length > 0 ? (
                <FlatList
                  data={suggestions}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.suggestionPrimary}>
                        {item.name.split(',')[0]}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.suggestionSecondary}>
                        {item.name.split(',').slice(1).join(',')}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : searchText.trim() ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No locations found</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{html: mapHtml}}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onMessage={event => setStatus(event.nativeEvent.data)}
          onLoad={() => setStatus('WebView loaded')}
          onError={error =>
            setStatus(`Error: ${error.nativeEvent.description}`)
          }
        />
      </View>

      {tiffLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0078D7" />
          <Text style={styles.overlayText}>Loading TIFF file...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  status: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 100,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
    position: 'relative',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionPrimary: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionSecondary: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noResultsContainer: {
    padding: 15,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontStyle: 'italic',
  },
  loaderContainer: {
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderText: {
    marginLeft: 10,
    color: '#666',
  },
  searchButton: {
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DummyMap;
