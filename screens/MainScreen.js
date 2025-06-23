import { useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";

const MainScreen = () => {
  const [isFast, setIsFast] = useState(true);

  const toggleFast = () => {
    setIsFast(prev => !prev);
  }

  return (
    <View style={styles.container}>
      <View style={styles.switchWrapper}>
        <Switch
          style={styles.switch}
          trackColor={{ false: '#359c21', true: '#e02828' }}
          ios_backgroundColor='#359c21'
          thumbColor='#fcfcfc'
          onValueChange={toggleFast}
          value={isFast}
        />
      </View>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  switchWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,

    borderColor: 'black',
  },
  switch: {
    marginRight: 20,
  }
})