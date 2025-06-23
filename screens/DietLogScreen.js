import { View, Text, StyleSheet } from "react-native";

const DietLogScreen = () => {
  return (
    <View style={styles.container}>
      <Text>식단 기록 화면</Text>
    </View>
  );
}

export default DietLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'white',
  }
});