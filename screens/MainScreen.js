import { StyleSheet, View, Text } from "react-native";

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text>텍스트임</Text>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})