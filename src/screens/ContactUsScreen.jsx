import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ContactUsScreen = () => {
  const navigation = useNavigation();

  const openURL = url => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F1F1F1" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require('../assets/icons/back.png')} // Leave empty for later import
            style={styles.backIcon}
          />
          <Text style={styles.headerTitle}>Contact us</Text>
        </TouchableOpacity>
      </View>

      {/* Flag background */}
      <View style={styles.flagContainer}>
        <Image
          source={null} // Leave empty for later import
          style={styles.flagImage}
        />
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <Text style={styles.locationTitle}>OUR LOCATION:</Text>
        <Text style={styles.addressText}>
          Secretary to Government of Punjab{'\n'}
          Gate No. 8, National Hockey Stadium{'\n'}
          Gaddafi Stadium, Ferozepur Road, Lahore
        </Text>

        <Text style={styles.sectionTitle}>Phone No:</Text>
        <Text style={styles.contactText}>+92-42-99231818</Text>
        <Text style={styles.contactText}>+92-42-99232236</Text>

        <Text style={styles.sectionTitle}>Email:</Text>
        <Text style={styles.contactText}>adisepa@punjan.gov.pk</Text>

        <Text style={styles.sectionTitle}>Helpline:</Text>
        <Text style={styles.contactText}>Helpline: 1373</Text>

        <View style={styles.socialSection}>
          <Text style={styles.socialText}>Follow us on:</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => openURL('https://facebook.com')}>
              <Image
                source={require('../assets/icons/facebook.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => openURL('https://twitter.com')}>
              <Image
                source={require('../assets/icons/twitter.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Environment Protection Department,{'\n'}
            Government of the Punjab
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    height: 55,
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  flagContainer: {
    height: 110,
    backgroundColor: '#4A6EB5',
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 3,
  },
  socialSection: {
    marginTop: 25,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ContactUsScreen;
