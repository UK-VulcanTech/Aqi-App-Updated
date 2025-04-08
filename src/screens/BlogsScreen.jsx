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
import raja from '../assets/images/raja.jpg';
import imran from '../assets/images/imran.png';

// Get device width for responsive sizing
const {width} = Dimensions.get('window');

const BlogsScreen = () => {
  const solutionCards = [
    {
      id: 1,
      image: maryam,
      alt: 'CM Punjab discussing air quality solutions',
      title: 'Chief Minister Punjab',
      subtitle: 'Ms. Maryam Nawaz',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: 2,
      image: raja,
      alt: 'Secratary EPD discussing air quality monitoring',
      title: 'Secratary EPD',
      subtitle: 'Mr. Raja Jahangir Anwar',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
    {
      id: 3,
      image: imran,
      alt: 'DG EPD discussing air quality monitoring',
      title: 'DG EPD',
      subtitle: 'Mr. Imran Hamid Sheikh',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Environment Protection Department
          </Text>

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
  scrollContainer: {
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  headerContainer: {
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 4,
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
    color: '#666',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#67AE6E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 'auto',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BlogsScreen;
