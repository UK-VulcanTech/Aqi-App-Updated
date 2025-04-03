import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import Header from '../components/dashboard/Header';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header /> */}
      <StatusBar backgroundColor="#F1F1F1" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          {/* Back icon placeholder */}
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      {/* Blue background with flag */}
      <View style={styles.flagContainer}>
        <Image
          source={require('../assets/images/pakistan-flag.png')}
          style={styles.flagImage}
        />
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Text style={styles.contentTitle}>About Us</Text>
            <Text style={styles.contentText}>
              Lorem ipsum dolor sit amet consectetur. Pharetra bibendum
              fringilla ullamcorper risus quis pretium feugiat aliquam.
              Facilisis nulla dignissim in nunc fames mi non lorem consectetur.
              Morbi congue arcu porttitor blandit nullam in luctus mattis morbi.
              Tempus nunc tincidunt sed ac sed commodo aliquam. Libero ultricies
              sit venenatis tortor consequat bibendum urna. Venenatis id cras id
              amet gravida tortor eget. Tellus nunc velit molestie aliquet non
              at dictum. A sit a in mattis convallis enim. Mi aliquet etiam quis
              elementum tempus pellentesque faucibus tortor. Porttitor nunc eros
              duis ultricies est. Aliquam ornare quisque a enim risus nisi.
              eget. Tellus nunc velit molestie aliquet non at dictum. A sit a in
              mattis convallis enim. Mi aliquet etiam quis elementum tempus
              pellentesque faucibus tortor. Porttitor nunc eros duis ultricies
              est. Aliquam ornare quisque a enim risus nisi.
            </Text>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 10, // Reduced from 24 to 10 to bring text closer to icon
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  flagContainer: {
    height: 100,
    backgroundColor: '#4A6EB5', // Fallback color
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: -25,
    marginHorizontal: 0,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  contentWrapper: {
    paddingLeft: 40, // Added padding from the left
    paddingRight: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 20,
  },
});

export default AboutUsScreen;
