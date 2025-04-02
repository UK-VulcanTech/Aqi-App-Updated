import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import LahoreMap from './src/components/map/LahoreMap';
// import Header from './src/components/Header'; // Make sure path is correct
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

// Wrapper component to include Header
const withHeader =
  (Component, showHeader = true) =>
  props =>
    (
      <View style={styles.container}>
        {showHeader && <Header />}
        <Component {...props} />
      </View>
    );

// Create a stack for the Home screens
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={withHeader(HomeScreen)} />
      <Stack.Screen name="About" component={withHeader(AboutUsScreen)} />
      <Stack.Screen name="Contact" component={withHeader(ContactUsScreen)} />
    </Stack.Navigator>
  );
}

// Create a stack for the Auth-related flows
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LoginScreen"
        component={withHeader(LoginScreen, false)} // No header for login
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
    <NavigationContainer>
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
          component={HomeStack}
          options={{
            tabBarIcon: homeIconRender,
          }}
          listeners={({navigation}) => ({
            tabPress: e => {
              // Prevent default behavior
              e.preventDefault();
              // Navigate to HomeScreen explicitly
              navigation.navigate('Home', {
                screen: 'HomeScreen',
              });
            },
          })}
        />
        <Tab.Screen
          name="Map"
          component={withHeader(LahoreMap, false)} // No header for map
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
          listeners={({navigation}) => ({
            tabPress: e => {
              // Prevent default behavior
              e.preventDefault();
              // Navigate to LoginScreen explicitly
              navigation.navigate('Login', {
                screen: 'LoginScreen',
              });
            },
          })}
        />
        <Tab.Screen
          name="Ranking"
          component={withHeader(PollutedTehsilsTable)}
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
