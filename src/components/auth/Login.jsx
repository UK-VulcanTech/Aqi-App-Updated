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

const Login = () => {
  return (
    <View style={styles.container}>
      {/* Background image as a container */}
      <ImageBackground
        source={require('../../assets/images/Building.png')}
        style={styles.backgroundImage}>
        {/* Login form */}
        <View style={styles.formContainer}>
          <View style={styles.innerContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/Logo.png')}
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
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#757575"
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#757575"
                  secureTextEntry
                />
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </View>

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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Darker overlay to match screenshot
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  logoContainer: {
    marginTop: height * 0.1, // Reduced top margin
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: 80,
    width: width * 0.8,
  },
  welcomeContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 45,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    lineHeight: 45,
    textShadowColor: 'rgba(0, 0, 0, 0.50)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  subText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 4,
    marginTop: 5,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    width: '100%', // Use percentage instead of fixed width
    height: 67,
    flexShrink: 0,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CECECE',
    backgroundColor: '#FFF',
    padding: 16,
    fontSize: 16,
  },
  inputContainer: {
    width: '100%', // Take 90% of the parent width
    alignSelf: 'center', // Center the container
    marginTop: 20,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'right',
    marginTop: 5,
    fontSize: 14,
  },
  loginButton: {
    display: 'flex',
    width: '100%', // Making it responsive while matching your design
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 79,
    backgroundColor: '#0EA959',
    marginTop: 20,
    // React Native shadow properties (equivalent to box-shadow)
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Login;

// rgba(255, 255, 255, 0.5)
