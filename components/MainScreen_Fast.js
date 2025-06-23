import { View, StyleSheet } from "react-native";

import FoodCardNews from "./FoodCardNews";

const MainScreen_Fast = () => {
  return (
    <View style={styles.container}>
      <FoodCardNews
        mode='fast'
      />
    </View>
  );
}

export default MainScreen_Fast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,

    borderColor: 'black',
    borderWidth: 1,
  }
});