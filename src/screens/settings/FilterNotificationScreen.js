// src/screens/settings/FilterNotificationScreen.js

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DebugButton from "../../components/DebugButton";
import { useNavigation } from "@react-navigation/native";

const FilterNotificationScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>알림 필터링 화면</Text>
      <DebugButton
        label="Go Back"
        onPress={() => navigation.goBack()}
        index={0}
      />
    </SafeAreaView>
  );
};

export default FilterNotificationScreen;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
