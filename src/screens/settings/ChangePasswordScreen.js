// src/screens/settings/ChangePasswordScreen.js

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DebugButton from "../../components/DebugButton";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>비밀번호 변경 화면</Text>
      <DebugButton
        label="Go Back"
        onPress={() => navigation.goBack()}
        index={0}
      />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
