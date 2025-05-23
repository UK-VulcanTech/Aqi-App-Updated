// SearchBox.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native';

const SearchBox = ({
  webViewRef,
  webViewLoaded,
  setStatus,
  onLocationSelect,
  searchResults,
  setSearchResults,
  showDropdown,
  setShowDropdown,
  onSearchInteraction, // Add this prop
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = () => {
    if (onSearchInteraction) {
      onSearchInteraction();
    } // Call the function to close the card

    if (!searchQuery.trim()) {
      return;
    }

    // Show we're waiting for results
    setStatus('Searching...');

    if (webViewRef.current && webViewLoaded) {
      const script = `
        try {
          searchLocation("${searchQuery.replace(/"/g, '\\"')}");
          true;
        } catch(e) {
          debug("Search error: " + e.message);
          true;
        }
      `;
      webViewRef.current.injectJavaScript(script);
      setShowDropdown(true);
    }
  };

  // Handle location selection
  const handleLocationSelect = location => {
    // Dismiss the keyboard
    Keyboard.dismiss();

    // Update search query
    setSearchQuery(location.name);

    // Call the parent component's handler
    onLocationSelect(location);

    // Clear search results and hide dropdown
    setTimeout(() => {
      setSearchResults([]);
      setShowDropdown(false);
    }, 300);
  };

  // Live search as user types - with timeout to prevent excessive API calls
  useEffect(() => {
    let timeoutId;

    if (searchQuery.length >= 2 && webViewRef.current && webViewLoaded) {
      // Set status to show searching
      setStatus('Searching...');

      timeoutId = setTimeout(() => {
        console.log('Searching for:', searchQuery);
        const script = `
          try {
            searchLocation("${searchQuery.replace(/"/g, '\\"')}");
            true;
          } catch(e) {
            debug("Search error: " + e.message);
            true;
          }
        `;
        webViewRef.current.injectJavaScript(script);
      }, 500); // Debounce for 500ms
    } else if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchQuery, webViewLoaded]);

  // Touch handler to close dropdown if user taps outside
  const handleOutsideTouch = () => {
    if (showDropdown) {
      setShowDropdown(false);
      Keyboard.dismiss();
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={text => {
            if (onSearchInteraction) {
              onSearchInteraction();
            } // Close card when typing
            setSearchQuery(text);
          }}
          onFocus={() => {
            if (onSearchInteraction) {
              onSearchInteraction();
            } // Close card when focused
          }}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          {/* <Text style={styles.searchIcon}>🔍</Text> */}
          <Image
            source={require('../../assets/icons/search.png')}
            style={{width: 20, height: 20, color: 'white'}}
          />
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
                {result.description && (
                  <Text style={styles.searchResultDescription}>
                    {result.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Touch handler to close dropdowns when clicking outside */}
      {showDropdown && (
        <TouchableOpacity
          style={styles.touchableOverlay}
          activeOpacity={0}
          onPress={handleOutsideTouch}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
    height: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    height: '100%',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    color: 'white',
    fontSize: 20,
  },
  searchDropdown: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    maxHeight: 200,
    elevation: 5,
    zIndex: 10,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchResultText: {
    fontSize: 14,
    color: 'white',
  },
  searchResultDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
});

export default SearchBox;
