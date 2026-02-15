import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Portal } from "@gorhom/portal";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import Colors from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MAIN_LAYOUT } from "../../constants/layout";
import { useAuthStore } from "../../stores/authStore";
import PersonIcon from "../../assets/icons/settings/person.svg";
import LockIcon from "../../assets/icons/settings/lock.svg";
import FilterIcon from "../../assets/icons/settings/filter.svg";
import SendIcon from "../../assets/icons/settings/send.svg";
import { LinearGradient } from "expo-linear-gradient";

const SettingsDrawer = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => console.log("로그아웃");
  const handleAccountInfo = () => console.log("계정 정보 이동");
  const handlePasswordChange = () => console.log("비밀번호 변경 이동");
  const handleFilter = () => console.log("필터 설정 이동");
  const handleContact = () => console.log("문의하기 (인스타 DM)");
  const handleReview = () => console.log("리뷰 남기기");
  const handlePrivacyPolicy = () => console.log("개인정보처리방침 이동");
  const handleTerms = () => console.log("이용약관 이동");
  const handleWithdrawal = () => console.log("회원탈퇴");

  if (!visible) return null;

  const SettingItem = ({ icon, title, description, onPress }) => (
    <Pressable style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemIcon}>{icon}</View>
      <View style={styles.itemStuffContainer}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.arrow}>{">"}</Text>
        </View>
        {description && (
          <Text style={styles.itemDescription}>{description}</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <Portal hostName="modal">
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
        >
          <Pressable style={styles.flex1} onPress={onClose} />
        </Animated.View>

        <View style={styles.centeredView} pointerEvents="box-none">
          <Animated.View
            entering={SlideInRight.duration(200).springify()}
            exiting={SlideOutRight.duration(200)}
            style={[
              styles.modalContent,
              { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>설정</Text>
              <Text style={styles.username}>
                @{user?.username || "idididid"}
              </Text>
            </View>
            <View style={styles.headerLine} />

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>내 계정</Text>
                  <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>로그아웃</Text>
                  </Pressable>
                </View>
                <SettingItem
                  icon={<PersonIcon width={20} height={20} />}
                  title="계정 정보"
                  description={`로그인 시 사용한 sns 계정을 포함한${"\n"}아이디와 이메일을 확인합니다.`}
                  onPress={handleAccountInfo}
                />
                <SettingItem
                  icon={<LockIcon width={20} height={20} />}
                  title="비밀번호 변경"
                  description="언제든지 비밀번호를 변경하세요."
                  onPress={handlePasswordChange}
                />
              </View>

              <LinearGradient
                style={styles.gradientBar}
                colors={[
                  Colors.text_gray,
                  Colors.text_gray,
                  Colors.background_white,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>알림</Text>
                <SettingItem
                  icon={<FilterIcon width={20} height={20} />}
                  title="필터"
                  description="불필요한 알람을 뮤트하세요."
                  onPress={handleFilter}
                />
              </View>

              <LinearGradient
                style={styles.gradientBar}
                colors={[
                  Colors.text_gray,
                  Colors.text_gray,
                  Colors.background_white,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleContact}
                  activeOpacity={0.7}
                >
                  <SendIcon width={16} height={16} />
                  <Text style={styles.contactText}>문의하기</Text>
                </TouchableOpacity>
                <Text style={styles.contactSubText}>
                  밥땡 인스타그램 다이렉트 메세지로{"\n"}문의할 수 있어요.
                </Text>

                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={handleReview}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reviewText}>리뷰 남기기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.footer}>
                <View style={styles.versionContainer}>
                  <Text style={styles.footerText}>앱 버전</Text>
                  <Text style={styles.versionText}>v.1.0.2</Text>
                </View>
                <Pressable
                  style={styles.footerLink}
                  onPress={handlePrivacyPolicy}
                >
                  <Text style={styles.footerText}>개인정보처리방침</Text>
                  <Text style={styles.arrow}>{">"}</Text>
                </Pressable>
                <Pressable style={styles.footerLink} onPress={handleTerms}>
                  <Text style={styles.footerText}>이용약관</Text>
                  <Text style={styles.arrow}>{">"}</Text>
                </Pressable>

                <Pressable
                  style={styles.withdrawalContainer}
                  onPress={handleWithdrawal}
                >
                  <Text style={styles.withdrawalText}>회원탈퇴</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Portal>
  );
};

export default SettingsDrawer;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 100,
  },
  modalContent: {
    width: "63%",
    minWidth: 240,
    height: "100%",
    backgroundColor: Colors.background_white,
    overflow: "hidden",
    borderColor: Colors.light_text_gray,
    borderLeftWidth: 1,
  },
  headerContainer: {
    height: MAIN_LAYOUT.HEADER,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.nurim,
    letterSpacing: -0.3,
    marginLeft: 8,
  },
  username: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
    letterSpacing: -0.1,
  },
  headerLine: {
    width: "96%",
    alignSelf: "center",
    height: 1,
    backgroundColor: Colors.light_text_gray,
  },
  section: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB",
    color: Colors.slightly_burn,
    letterSpacing: -0.3,
  },
  logoutButton: {
    backgroundColor: "#F5F4F2",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  itemIcon: {
    width: 20,
    height: 20,
    marginTop: -1,
    marginRight: 5,
  },
  itemStuffContainer: {
    flex: 1,
    paddingRight: 8,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.burn,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    color: Colors.slightly_burn,
    lineHeight: 15,
    letterSpacing: -0.3,
  },
  arrow: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
    marginTop: -4,
  },
  gradientBar: {
    marginTop: 12,
    width: "92%",
    alignSelf: "flex-end",
    height: 0.4,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingTop: 30,
    alignItems: "center",
  },
  contactButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#FFCC80",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  contactIcon: {
    width: 16,
    height: 16,
    backgroundColor: Colors.background_white,
    marginRight: 8,
  },
  contactText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.background_white,
    letterSpacing: -0.3,
  },
  contactSubText: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
    textAlign: "left",
    letterSpacing: -0.3,
    marginTop: 8,
    marginBottom: 16,
  },
  reviewButton: {
    width: "100%",
    height: 44,
    borderWidth: 1.5,
    borderColor: Colors.point_red,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.point_red,
    letterSpacing: -0.3,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    marginLeft: 20,
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  footerText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.burn,
    letterSpacing: -0.3,
  },
  versionText: {
    fontSize: 14,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
  },
  withdrawalContainer: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
  withdrawalText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.text_gray,
    textDecorationLine: "underline",
  },
});
