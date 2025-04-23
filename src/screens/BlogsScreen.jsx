import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

// Import images
import maryam from '../assets/images/maryam.jpg';
import raja from '../assets/images/raja-epd.jpg';
import imran from '../assets/images/imran.png';
import maryamA from '../assets/images/maryam-a.jpeg';
import backIcon from '../assets/icons/back.png'; // Import your back icon image

// Get device width for responsive sizing
const {width} = Dimensions.get('window');

// Define light green color to use throughout
const lightGreen = '#67AE6E';

const BlogsScreen = ({navigation}) => {
  const solutionCards = [
    {
      id: 1,
      image: maryam,
      alt: 'CM Punjab discussing air quality monitoring',
      title: 'Chief Minister Punjab',
      subtitle: 'Ms. Maryam Nawaz',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: 2,
      image: maryamA,
      alt: 'Senior Minsiter Punjab discussing air quality monitoring',
      title: 'Senior Minister Punjab',
      subtitle: 'Ms. Maryam Aurangzeb',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: 3,
      image: raja,
      alt: 'Secratary EPCCD discussing air quality monitoring',
      title: 'Secratary EPCCD',
      subtitle: 'Mr. Raja Jahangir Anwar',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
    {
      id: 4,
      image: imran,
      alt: 'DG EPA discussing air quality monitoring',
      title: 'DG EPA',
      subtitle: 'Mr. Imran Hamid Sheikh',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Back header */}
      <View style={styles.backHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={styles.backIconImage} />
          <Text style={styles.backHeaderText}>Blogs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Enhanced Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerCaption}>BLOGS</Text>
            <Text style={styles.headerText}>
              Environment Protection and Climate Change Department
            </Text>
            <View style={styles.headerDivider} />
            <Text style={styles.headerSubtext}>
              Leading the way towards a cleaner, healthier Punjab
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {solutionCards.map((card, index) => {
              const isEven = index % 2 === 1; // true for 2nd, 4th, 6th... cards

              return (
                <View key={card.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    {!isEven && (
                      <Image source={card.image} style={styles.cardImage} />
                    )}

                    <View style={styles.textContainer}>
                      <Text style={styles.titleText}>{card.title}</Text>
                      <Text style={styles.subtitleText}>{card.subtitle}</Text>
                      <Text numberOfLines={4} style={styles.descriptionText}>
                        {card.description}
                      </Text>

                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Read Blog</Text>
                      </TouchableOpacity>
                    </View>

                    {isEven && (
                      <Image source={card.image} style={styles.cardImage} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  backHeader: {
    height: 56,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  backHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  headerContainer: {
    paddingVertical: 20,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCaption: {
    fontSize: 12,
    fontWeight: '700',
    color: lightGreen,
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerDivider: {
    width: 60,
    height: 3,
    backgroundColor: lightGreen,
    marginBottom: 12,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cardsContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: width * 0.55, // Fixed height based on device width ratio
    borderLeftWidth: 3,
    borderLeftColor: lightGreen,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  cardImage: {
    width: width * 0.38,
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  textContainer: {
    width: width * 0.38,
    justifyContent: 'flex-start',
    padding: 0,
    paddingHorizontal: 6,
  },
  titleText: {
    fontSize: 12,
    color: lightGreen,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#666',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightGreen, // Changed to light green
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 'auto',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BlogsScreen;
