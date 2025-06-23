import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import fastFoodData from '../data/fastFoodData.json';
import slowFoodData from '../data/slowFoodData.json';

const { width } = Dimensions.get('window');
const cardMargin = 16;

const FoodCardNews = ({ mode }) => {
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardImage}>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      {mode === 'slow' &&
        <View style={styles.calorieBox}>
          <Text style={styles.calorieText}>{item.calorie} cal</Text>
        </View>
      }
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mode === 'fast' ? fastFoodData : slowFoodData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: cardMargin }}
        ItemSeparatorComponent={() => <View style={{ width: cardMargin * 2 }} />}
      />
    </View>
  );
};

export default FoodCardNews;

const styles = StyleSheet.create({
  container: {
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardImage: {
    width: width - cardMargin * 2 - 2,
    height: width - cardMargin * 2 - 2,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fcfcfc',
    borderColor: 'black',
    borderWidth: 1,
  },
  name: {
    fontSize: 50,
  },
  calorieBox: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: -20,
    textAlign: 'center',

    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
  calorieText: {
    fontSize: 25,
  }
});
