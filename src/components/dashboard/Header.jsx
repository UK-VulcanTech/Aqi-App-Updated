import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = (open = !menuOpen) => {
    // If opening the menu
    if (open) {
      setMenuOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // If closing the menu - faster animation
    else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200, // Reduced from 300ms to 200ms
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200, // Reduced from 300ms to 200ms
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMenuOpen(false);
      });
    }
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow right swipes (positive dx)
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
          // Calculate overlay opacity based on menu position
          const newOpacity = 0.5 * (1 - gestureState.dx / 300);
          overlayAnim.setValue(Math.max(0, newOpacity));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped more than 1/3 of the menu width, close it
        if (gestureState.dx > 100) {
          toggleMenu(false);
        } else {
          // Otherwise snap back to open position
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  // Menu items definition
  const menuItems = [
    {icon: require('../../assets/icons/phone.png'), label: 'Dashboard'},
    {icon: require('../../assets/icons/clock.png'), label: 'History'},
    {icon: require('../../assets/icons/file.png'), label: 'Policy'},
    {icon: require('../../assets/icons/persons.png'), label: 'About Us'},
    {icon: require('../../assets/icons/contact.png'), label: 'Contact Us'},
  ];

  return (
    <>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icons/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => toggleMenu(true)}>
          <Image
            source={require('../../assets/icons/hamburger.png')}
            style={styles.hamburgerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <>
          {/* Backdrop overlay */}
          <TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
            <Animated.View style={[styles.overlay, {opacity: overlayAnim}]} />
          </TouchableWithoutFeedback>

          {/* Sliding menu */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.slideMenu, {transform: [{translateX: slideAnim}]}]}>
            {/* User profile section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image
                  // You'll need to replace this with your actual profile image
                  source={require('../../assets/icons/hamburger.png')}
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.profileName}>Ahmad ali</Text>
            </View>

            {/* Menu items */}
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem}>
                  <View style={styles.menuIconContainer}>
                    <Image
                      source={item.icon}
                      style={styles.menuIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout button */}
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#262626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 150,
    height: 50,
  },
  menuButton: {
    padding: 5,
  },
  hamburgerIcon: {
    width: 30,
    height: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 2,
  },
  slideMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 250, // Reduced from 300 to match the image
    height: '100%',
    backgroundColor: '#f5f5f5',
    zIndex: 3,
    paddingTop: 20,
    paddingHorizontal: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  profileName: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItems: {
    flex: 1,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    marginRight: 15,
    opacity: 0.6,
  },
  menuIcon: {
    width: '100%',
    height: '100%',
  },
  menuText: {
    color: '#333',
    fontSize: 14,
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontWeight: '500',
  },
});

export default Header;
