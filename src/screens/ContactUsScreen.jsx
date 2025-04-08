import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
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

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = emailAddress => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  const handleMap = () => {
    const address = 'Gaddafi Stadium, Ferozepur Road, Lahore';
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = '31.5204,74.3587';
    const label = 'Environment Protection Department';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

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
          {/* Title and Emblem */}
          <View style={styles.titleSection}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Emblem_of_Pakistan.svg',
              }}
              style={styles.emblem}
            />
            <Text style={styles.titleText}>Contact Us</Text>
            <Text style={styles.subtitleText}>
              Environment Protection Department
            </Text>
          </View>

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

            <View style={styles.divider} />

            {/* Working Hours Section */}
            <View style={styles.hoursSection}>
              <View
                style={[
                  styles.sectionIconContainer,
                  {backgroundColor: '#E8F5E9'},
                ]}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png',
                  }}
                  style={[styles.sectionIcon, {tintColor: '#2E8B57'}]}
                />
              </View>
              <Text style={styles.sectionTitle}>Working Hours</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Monday - Thursday:</Text>
                <Text style={styles.timeText}>9:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Friday:</Text>
                <Text style={styles.timeText}>9:00 AM - 1:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Saturday - Sunday:</Text>
                <Text style={styles.timeText}>Closed</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Location Section */}
            <View style={styles.locationSection}>
              <View
                style={[
                  styles.sectionIconContainer,
                  {backgroundColor: '#E8F5E9'},
                ]}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                  }}
                  style={[styles.sectionIcon, {tintColor: '#2E8B57'}]}
                />
              </View>
              <Text style={styles.sectionTitle}>Visit Us</Text>
              <TouchableOpacity onPress={handleMap}>
                <Text style={styles.contactText}>
                  Gaddafi Stadium, Ferozepur Road, Lahore, Punjab
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Social Media Section */}
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
                    style={[styles.socialIcon, {tintColor: '#2E8B57'}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://twitter.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
                    }}
                    style={[styles.socialIcon, {tintColor: '#2E8B57'}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://instagram.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
                    }}
                    style={[styles.socialIcon, {tintColor: '#2E8B57'}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openURL('https://youtube.com')}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                    }}
                    style={[styles.socialIcon, {tintColor: '#2E8B57'}]}
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
              Environment Protection Department, Government of the Punjab
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 0,
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#333',
  },
  dashboardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  dashboardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emblem: {
    width: 70,
    height: 70,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  contactUsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactUsIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  contactUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  aboutUsContent: {
    marginBottom: 8,
  },
  aboutUsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  missionSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  missionIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  missionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF0',
    marginVertical: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactColumn: {
    flex: 1,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  hoursSection: {
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  daysText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  locationSection: {
    marginBottom: 16,
  },
  socialSection: {
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  footerFlag: {
    width: 24,
    height: 16,
    marginRight: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});

export default ContactUsScreen;
