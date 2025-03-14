import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      {/* Background image as a container */}
      <ImageBackground
        source={require('../assets/images/Building.png')}
        style={styles.backgroundImage}>
        {/* Login form */}
        <View style={styles.formContainer}>
          <View style={styles.innerContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.subText}>
                Login in to your account to continue
              </Text>
            </View>

            <View style={styles.inputContainer}>
              {/* Email Field */}
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#757575"
              />

              {/* Password Field */}
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#757575"
                secureTextEntry
              />

              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: height * 0.16,
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: 80,
    width: width * 0.8,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  subText: {
    fontSize: 16,
    color: '#837d7d',
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    width: '90%',
    marginTop: 20,
  },
  input: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#2A2F34',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    padding: 14,
    backgroundColor: '#0EA959',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default LoginScreen;
