// src/components/MainScreen/LastMarshmallowModal.js

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/colors";
import CloseIcon from "../../assets/icons/close-x.svg";
import Marsh_1_1 from "../../assets/images/marshmallows/marsh_1-1.svg";
import Marsh_1_2 from "../../assets/images/marshmallows/marsh_1-2.svg";
import Marsh_2_1 from "../../assets/images/marshmallows/marsh_2-1.svg";
import Marsh_2_2 from "../../assets/images/marshmallows/marsh_2-2.svg";
import Marsh_3_1 from "../../assets/images/marshmallows/marsh_3-1.svg";
import Marsh_3_2 from "../../assets/images/marshmallows/marsh_3-2.svg";
import Marsh_4_1 from "../../assets/images/marshmallows/marsh_4-1.svg";
import Marsh_4_2 from "../../assets/images/marshmallows/marsh_4-2.svg";
import QuestionMarshmallow from "../common/QuestionMarshmallow";
import { useNavigation } from "@react-navigation/native";
import AnimatedMarshmallow from "../common/AnimatedMarshmallow";

const getMarshmallowSvgByStatus = (status, variant) => {
  switch (status) {
    case 1:
      return variant === 0 ? Marsh_1_1 : Marsh_1_2;
    case 2:
      return variant === 0 ? Marsh_2_1 : Marsh_2_2;
    case 3:
      return variant === 0 ? Marsh_3_1 : Marsh_3_2;
    case 0:
    case -1:
      return variant === 0 ? Marsh_4_1 : Marsh_4_2;
    case -2:
      return QuestionMarshmallow;
    default:
      return null;
  }
};

const LastMarshmallowModal = ({ marshmallow, onClose }) => {
  const navigation = useNavigation();

  const handleGoToDietLog = () => {
    onClose();
    navigation.navigate("DietLog");
  };

  if (!marshmallow) return null;

  return (
    <View style={styles.container}>
      <View style={styles.whiteContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <CloseIcon width={30} height={30} color={Colors.burn} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>지난 주의 마시멜로가 완성됐어요!</Text>
          <Text style={styles.week}>Week {marshmallow.week}</Text>

          <View style={styles.marshmallowContainer}>
            <AnimatedMarshmallow
              status={marshmallow.status}
              getSvg={getMarshmallowSvgByStatus}
            />
          </View>

          <Text style={styles.stats}>
            총 리뷰 {marshmallow.reviewCount}개, 평균 별점{" "}
            {(marshmallow.totalRating / marshmallow.reviewCount).toFixed(1)}점
          </Text>
          <TouchableOpacity
            style={styles.goSeeButton}
            onPress={handleGoToDietLog}
          >
            <Text style={styles.goSeeButtonText}>바로 보러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LastMarshmallowModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  whiteContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.background_white,
    borderRadius: 24,
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
    borderColor: Colors.light_text_gray,
    borderWidth: 1,
    borderRadius: 12,
  },
  title: {
    color: Colors.burn,
    fontSize: 18,
    fontFamily: "NanumSquareRoundB",
    letterSpacing: -0.4,
  },
  week: {
    color: Colors.text_gray,
    fontSize: 14,
    fontFamily: "NanumSquareRoundR",
  },
  marshmallowContainer: {
    marginTop: 28,
    marginBottom: 28,
  },
  stats: {
    color: Colors.slightly_burn,
    fontSize: 12,
    fontFamily: "NanumSquareRoundR",
    letterSpacing: -0.3,
  },
  goSeeButton: {
    width: "100%",
    backgroundColor: Colors.burn,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 4,
  },
  goSeeButtonText: {
    color: Colors.background_white,
    fontSize: 16,
    fontFamily: "NanumSquareB",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
});
