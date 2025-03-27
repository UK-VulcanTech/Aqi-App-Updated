import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import LahoreMap from './src/components/map/LahoreMap';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ReankingScreen from './src/screens/RankingScreen';
import AdminDashboard from './src/components/admin/AdminDashboard';
import CreateUser from './src/components/admin/CreateUser';
import Profile from './src/components/admin/Profile';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import PollutedTehsilsTable from './src/screens/PollutedTehsilsScreen';
import UserDashboard from './src/components/user/UserDashboard';
import SensorRecords from './src/components/user/SensorRecords';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// Icon renderers
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

// Create a stack for the Login flow - remove AboutUsScreen from here
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="sensor" component={SensorRecords} />
    </Stack.Navigator>
  );
}

// Create main tab navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2A2F34',
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
        component={AuthStack}
        options={{
          tabBarIcon: loginIconRender,
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={PollutedTehsilsTable}
        options={{
          tabBarIcon: profileIconRender,
        }}
      />
    </Tab.Navigator>
  );
}

// Root stack that contains MainTabNavigator and standalone screens
function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        <RootStack.Screen name="about" component={AboutUsScreen} />
        <RootStack.Screen name="contact" component={ContactUsScreen} />
      </RootStack.Navigator>
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
