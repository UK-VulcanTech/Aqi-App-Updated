import React, {useState} from 'react';
import {
  View,
  Text,
  // StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';

const ContactUsScreen = () => {
  const navigation = useNavigation();

  const openURL = url => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = emailAddress => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  // const handleMap = () => {
  //   const address = 'Gaddafi Stadium, Ferozepur Road, Lahore';
  //   const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  //   const latLng = '31.5204,74.3587';
  //   const label = 'Environment Protection Department';
  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });

  //   Linking.openURL(url);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png',
              }}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.dashboardContainer}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828765.png',
              }}
              // style={styles.dashboardIcon}
            />
            <Text style={styles.dashboardText}>Contact Us</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* About Us Card */}
          <View style={styles.mainCard}>
            {/* About Us Title with Icon */}
            <View style={styles.contactUsTitleContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png',
                }}
                style={[styles.contactUsIcon, {tintColor: '#2E8B57'}]}
              />
              <Text style={styles.contactUsTitle}>About Us</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.aboutUsContent}>
              <Text style={styles.aboutUsText}>
                The Environment Protection Department (EPD) of Punjab is
                committed to safeguarding our natural resources and ensuring
                environmental sustainability. Established under the Punjab
                Environment Protection Act, we work tirelessly to monitor,
                protect, and enhance the environmental quality across the
                province.
              </Text>

              <View style={styles.missionSection}>
                <View style={styles.missionIconContainer}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/3658/3658773.png',
                    }}
                    style={[styles.sectionIcon, {tintColor: '#2E8B57'}]}
                  />
                  <Text style={styles.missionTitle}>Our Mission</Text>
                </View>
                <Text style={styles.missionText}>
                  To protect, conserve and improve the environment, prevent and
                  control pollution, and promote sustainable development in
                  Punjab.
                </Text>
              </View>
            </View>
          </View>

          {/* Main Contact Card */}
          <View style={styles.mainCard}>
            {/* Contact Us Title with Icon */}
            <View style={styles.contactUsTitleContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3059/3059502.png',
                }}
                style={[styles.contactUsIcon, {tintColor: '#2E8B57'}]}
              />
              <Text style={styles.contactUsTitle}>Contact Us</Text>
            </View>

            <View style={styles.divider} />

            {/* Contact Row (Phone and Email side by side) */}
            <View style={styles.contactRow}>
              {/* Phone Section */}
              <View style={styles.contactColumn}>
                <View
                  style={[
                    styles.sectionIconContainer,
                    {backgroundColor: '#E8F5E9'},
                  ]}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/455/455705.png',
                    }}
                    style={[styles.sectionIcon, {tintColor: '#2E8B57'}]}
                  />
                </View>
                <Text style={styles.sectionTitle}>Call Us</Text>
                <TouchableOpacity onPress={() => handleCall('924299231818')}>
                  <Text style={styles.contactText}>+92-42-99231818</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCall('924299232236')}>
                  <Text style={styles.contactText}>+92-42-99232236</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCall('1373')}>
                  <Text style={styles.contactText}>Helpline: 1373</Text>
                </TouchableOpacity>
              </View>

              {/* Email Section */}
              <View style={styles.contactColumn}>
                <View
                  style={[
                    styles.sectionIconContainer,
                    {backgroundColor: '#E8F5E9'},
                  ]}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/552/552486.png',
                    }}
                    style={[styles.sectionIcon, {tintColor: '#2E8B57'}]}
                  />
                </View>
                <Text style={styles.sectionTitle}>Email Us</Text>
                <TouchableOpacity
                  onPress={() => handleEmail('adisepa@punjab.gov.pk')}>
                  <Text style={styles.contactText}>adisepa@punjab.gov.pk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Social Media Section as separate card with original icons */}
          <View style={styles.mainCard}>
            <View style={styles.socialSection}>
              <Text style={styles.sectionTitle}>Connect With Us</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://facebook.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
                    }}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://twitter.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
                    }}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://instagram.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
                    }}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://youtube.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                    }}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg',
              }}
              style={styles.footerFlag}
            />
            <Text style={styles.footerText}>
              {/* Environment Protection Department, Government of the Punjab */}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
