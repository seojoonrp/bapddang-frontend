// src/screens/settings/FilterNotificationScreen.js

import { Text, TouchableOpacity, View } from "react-native";
import SettingMenuHeader from "../../components/common/SettingMenuHeader";
import Colors from "../../constants/colors";
import CheckIcon from "../../assets/icons/settings/check.svg";
import { useNotificationStore } from "../../stores/notificationStore";

const FilterNotificationScreen = () => {
  const newMarshmallowEnabled = useNotificationStore(
    (state) => state.newMarshmallow,
  );
  const toggleNewMarshmallow = useNotificationStore(
    (state) => state.toggleNewMarshmallow,
  );

  return (
    <View style={styles.container}>
      <SettingMenuHeader title="알림 필터 설정" />

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>마시멜로 추가 알림</Text>
          <TouchableOpacity
            style={[
              styles.checkBox,
              newMarshmallowEnabled && styles.checkBoxActive,
            ]}
            onPress={toggleNewMarshmallow}
            activeOpacity={0.7}
          >
            {newMarshmallowEnabled && <CheckIcon width={14} height={14} />}
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>신메뉴 추가 알림</Text>
          <Text style={styles.value}>개발중인 기능입니다!</Text>
        </View>
      </View>
    </View>
  );
};

export default FilterNotificationScreen;

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.background_white,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 28,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.nurim,
    letterSpacing: -0.3,
  },
  value: {
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    color: Colors.slightly_burn,
    letterSpacing: -0.3,
  },
  checkBox: {
    width: 23,
    height: 23,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.nurim,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxActive: {
    backgroundColor: Colors.nurim,
  },
};
