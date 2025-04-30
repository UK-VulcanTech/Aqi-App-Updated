import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';
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
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      {/* Blue background with flag */}
      <View style={styles.flagContainer}>
        <Image
          source={require('../../assets/images/pakistan-flag.png')}
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

export default AboutUsScreen;
