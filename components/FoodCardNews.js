import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';

import fastFoodData from '../data/fastFoodData.json';
import slowFoodData from '../data/slowFoodData.json';

const { width } = Dimensions.get('window');
const cardMargin = 16;

const FoodCardNews = ({ mode }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={mode === 'fast' ? fastFoodData : slowFoodData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: cardMargin + 1, paddingHorizontal: cardMargin }}
      ItemSeparatorComponent={() => <View style={{ width: cardMargin * 2 }} />}
    />
  );
};

export default FoodCardNews;

const styles = StyleSheet.create({
  card: {
    width: width - cardMargin * 2 - 2,
    height: width - cardMargin * 2 - 2,
    justifyContent: 'center',
    alignItems: 'center',

    borderColor: 'black',
    borderWidth: 1,
  },
  name: {
    fontSize: 40,
  },
});
