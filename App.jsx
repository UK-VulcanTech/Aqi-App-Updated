import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import LahoreMap from './src/components/map/LahoreMap';
import Header from './src/components/dashboard/Header';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import PollutedTehsilsTable from './src/screens/PollutedTehsilsScreen';
import UserDashboard from './src/components/user/UserDashboard';
import SensorRecords from './src/components/user/SensorRecords';
import AdminDashboard from './src/components/admin/AdminDashboard';
import CreateUser from './src/components/admin/CreateUser';
import AdminProfile from './src/components/admin/AdminProfile';
import EditAdminProfile from './src/components/admin/EditAdminProfile';
import BlogsScreen from './src/screens/BlogsScreen';
import SensorDataForm from './src/screens/SensorData/SensorDataForm';

// Create a client with better caching settings for WebSocket support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Prevent automatic refetching that might override WebSocket updates
      cacheTime: 1000 * 60 * 60, // Longer cache time to maintain data
    },
  },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simplified icon renderer function
const getTabIcon =
  source =>
  ({focused}) =>
    (
      <Image
        source={source}
        style={focused ? styles.activeIcon : styles.inactiveIcon}
      />
    );

// More efficient header wrapper
const withHeader = (Component, showHeader = true) => {
  const WrappedComponent = props => (
    <View style={styles.container}>
      {showHeader && <Header />}
      <Component {...props} />
    </View>
  );

  // Improve component name for debugging
  WrappedComponent.displayName = `withHeader(${
    Component.displayName || Component.name || 'Component'
  })`;
  return WrappedComponent;
};

// Home stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={withHeader(HomeScreen)} />
      <Stack.Screen name="About" component={withHeader(AboutUsScreen)} />
      <Stack.Screen name="Contact" component={withHeader(ContactUsScreen)} />
      <Stack.Screen name="Blogs" component={withHeader(BlogsScreen)} />
    </Stack.Navigator>
  );
}

// Auth stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LoginScreen"
        component={withHeader(LoginScreen, false)}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={withHeader(AdminDashboard)}
      />
      <Stack.Screen
        name="UserDashboard"
        component={withHeader(UserDashboard)}
      />
      <Stack.Screen name="CreateUser" component={withHeader(CreateUser)} />
      <Stack.Screen name="AdminProfile" component={withHeader(AdminProfile)} />
      <Stack.Screen
        name="EditAdminProfile"
        component={withHeader(EditAdminProfile)}
      />
      <Stack.Screen
        name="SensorRecords"
        component={withHeader(SensorRecords)}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: styles.tabBar,
            lazy: false,
          }}>
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: getTabIcon(require('./src/assets/icons/home1.png')),
            }}
          />
          <Tab.Screen
            name="Map"
            component={withHeader(LahoreMap, false)}
            options={{
              tabBarIcon: getTabIcon(
                require('./src/assets/icons/location1.png'),
              ),
            }}
          />
          <Tab.Screen
            name="Data"
            component={withHeader(SensorDataForm)}
            options={{
              tabBarIcon: getTabIcon(require('./src/assets/icons/data.png')),
            }}
          />
          <Tab.Screen
            name="Login"
            component={AuthStack}
            options={{
              tabBarIcon: getTabIcon(require('./src/assets/icons/user1.png')),
            }}
          />
          <Tab.Screen
            name="Ranking"
            component={withHeader(PollutedTehsilsTable)}
            options={{
              tabBarIcon: getTabIcon(require('./src/assets/icons/rank.png')),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
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
  tabBar: {
    backgroundColor: '#2A2F34',
  },
});

export default App;
