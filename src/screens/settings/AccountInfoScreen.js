// src/screens/settings/AccountInfoScreen.js

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DebugButton from "../../components/DebugButton";
import { useNavigation } from "@react-navigation/native";

const AccountInfoScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>계정 정보 화면</Text>
      <DebugButton
        label="Go Back"
        onPress={() => navigation.goBack()}
        index={0}
      />
    </SafeAreaView>
  );
};

export default AccountInfoScreen;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
