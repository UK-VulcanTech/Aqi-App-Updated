import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LahoreMap from './src/components/map/LahoreMap';

// Import or create these additional screens
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
// import LoginScreen from './src/screens/LoginScreen';
import Login from './src/components/auth/Login';
import ReankingsScreen from './src/screens/RankingScreen';

const Tab = createBottomTabNavigator();

// Define all icon render functions outside of the component completely

const homeIconRender = ({focused}) => (
  <Image
    source={require('./src/assets/icons/home_outline.png')}
    style={focused ? styles.activeIcon : styles.inactiveIcon}
  />
);
const mapIconRender = ({focused}) => (
  <Image
    source={require('./src/assets/icons/location.png')}
    style={focused ? styles.activeIcon : styles.inactiveIcon}
  />
);

const loginIconRender = ({focused}) => (
  <Image
    source={require('./src/assets/icons/profile.png')}
    style={focused ? styles.activeIcon : styles.inactiveIcon}
  />
);

const profileIconRender = ({focused}) => (
  <Image
    source={require('./src/assets/icons/ranking.png')}
    style={focused ? styles.activeIcon : styles.inactiveIcon}
  />
);

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#2A2F34', // Adding red background color to the tab bar
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: homeIconRender,
          }}
        />
        <Tab.Screen
          name="Map"
          component={LahoreMap}
          options={{
            tabBarIcon: mapIconRender,
          }}
        />
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarIcon: loginIconRender,
          }}
        />
        <Tab.Screen
          name="Ranking"
          component={ReankingsScreen}
          options={{
            tabBarIcon: profileIconRender,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  inactiveIcon: {
    width: 24,
    height: 24,
    tintColor: 'gray',
  },
});

export default App;
