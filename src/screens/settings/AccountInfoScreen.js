// src/screens/settings/AccountInfoScreen.js

import { Text, View } from "react-native";
import SettingMenuHeader from "../../components/common/SettingMenuHeader";
import Colors from "../../constants/colors";
import { useAuthStore } from "../../stores/authStore";

const AccountInfoScreen = () => {
  const user = useAuthStore((state) => state.user);

  const formatLoginMethod = (method) => {
    if (!method) return "제공되지 않음";
    switch (method) {
      // case "kakao":
      //   return "카카오";
      case "apple":
        return "Apple";
      case "google":
        return "Google";
      default:
        return "아이디/비밀번호";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "제공되지 않음";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View style={styles.container}>
      <SettingMenuHeader title="계정 정보" />

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>아이디</Text>
          <Text style={styles.value}>{user?.username || "아이디 없음"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>로그인 방법</Text>
          <Text style={styles.value}>
            {formatLoginMethod(user?.loginMethod)}
          </Text>
        </View>
        {user.email && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>이메일</Text>
            <Text style={styles.value}>{user?.email || "제공되지 않음"}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>가입일</Text>
          <Text style={styles.value}>{formatDate(user?.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

export default AccountInfoScreen;

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
};
