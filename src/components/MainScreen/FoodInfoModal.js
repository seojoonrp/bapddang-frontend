// src/components/MainScreen/FoodInfoModal.js

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { handleLike, handleUnlike } from "../../services/like";
import { useAuthStore } from "../../stores/authStore";
import Colors from "../../constants/colors";
import CloseIcon from "../../assets/icons/close-x.svg";
import HeartIcon from "../../components/svg/HeartIcon";
import EditIcon from "../../assets/icons/edit.svg";
import KakaoMap from "../common/KakaoMap";
import { useEffect, useState } from "react";
import Animated, {
  ZoomIn,
  ZoomInEasyDown,
  ZoomOut,
  ZoomOutEasyDown,
} from "react-native-reanimated";
import { useFoodStore } from "../../stores/foodStore";
import { useModeStore } from "../../stores/modeStore";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import LoadingPlaceholer from "../common/LoadingPlaceholer";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const FoodInfoModal = ({ foodID, onClose, onCreateReview }) => {
  if (!foodID) return null;
  const item = useFoodStore((state) => state.foodsByID[foodID]);
  const toggleLike = useFoodStore((state) => state.toggleLike);
  if (!item) return null;
  const { food, isLiked } = item;

  const { user } = useAuthStore();
  const [location, setLocation] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const modeColor = useModeStore((state) => state.modeColor);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLocationDenied(true);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const onLikePress = async () => {
    if (!user) return;

    toggleLike(food.id);

    try {
      if (!isLiked) await handleLike(food.id);
      else await handleUnlike(food.id);
    } catch (error) {
      console.log("Error updating like status:", error);
      toggleLike(food.id);
    }
  };

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [distance, setDistance] = useState("");
  const [noResults, setNoResults] = useState(false);
  useEffect(() => {
    if (selectedPlace) {
      const d = selectedPlace.distance;
      if (d < 1000) {
        setDistance(`${d}m`);
      } else {
        setDistance(`${(d / 1000).toFixed(1)}km`);
      }
    } else {
      setDistance("");
    }
  }, [selectedPlace]);

  const handleCreateReview = () => {
    onClose();
    if (onCreateReview) onCreateReview(food.name);
  };

  const openKakaoMap = async () => {
    if (!selectedPlace) return;

    const { place_name, x, y } = selectedPlace;
    const url = `kakaomap://search?q=${encodeURIComponent(place_name)}&lookMode=1`;
    const webUrl = `https://map.kakao.com/link/search/${encodeURIComponent(place_name)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Linking.openURL(webUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <CloseIcon width={30} height={30} color={Colors.burn} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.foodImage} source={{ uri: food.imageURL }} />
          </View>

          <Text style={styles.foodName}>{food.name}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: modeColor }]}
              onPress={handleCreateReview}
              activeOpacity={0.7}
            >
              <EditIcon
                width={19}
                height={19}
                color={Colors.background_white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: modeColor }]}
              onPress={onLikePress}
              activeOpacity={0.7}
            >
              <HeartIcon
                size={20}
                fillColor={isLiked ? Colors.background_white : "transparent"}
                strokeColor={Colors.background_white}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryRow}>
            {food.categories.map((category) => (
              <View key={category} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>

          <View style={styles.mapContainer}>
            {locationDenied ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.permissionText}>
                  지도를 보려면{"\n"}위치 권한을 허용해주세요!
                </Text>
              </View>
            ) : location ? (
              <KakaoMap
                keyword={food.name}
                lat={location.latitude}
                lon={location.longitude}
                onSelectPlace={setSelectedPlace}
                onNoResults={() => setNoResults(true)}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <LoadingPlaceholer text="지도를 불러오는 중..." />
              </View>
            )}

            {selectedPlace && (
              <AnimatedTouchableOpacity
                entering={ZoomInEasyDown.duration(250)}
                exiting={ZoomOutEasyDown.duration(200)}
                style={styles.placeInfoContainer}
                onPress={openKakaoMap}
                activeOpacity={0.75}
              >
                <Text style={styles.placeName}>{selectedPlace.place_name}</Text>
                <Text style={styles.placeAddress}>
                  {selectedPlace.address_name}
                </Text>
              </AnimatedTouchableOpacity>
            )}
          </View>

          <View style={styles.distanceContainer}>
            {noResults ? (
              <Text
                style={[
                  styles.distanceText,
                  { color: Colors.text_gray, fontSize: 12 },
                ]}
              >
                5km 이내에 해당 음식을 판매하는 음식점이 없어요.
              </Text>
            ) : distance !== "" ? (
              <Animated.View
                entering={ZoomIn.duration(250)}
                exiting={ZoomOut.duration(200)}
              >
                <Text style={styles.distanceText}>
                  <Text
                    style={{
                      color: modeColor,
                      fontFamily: "NanumSquareEB",
                    }}
                  >
                    {distance}{" "}
                  </Text>
                  떨어진 곳에 있어요!
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodInfoModal;

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
    paddingVertical: 16,
    gap: 12,
    borderColor: Colors.light_text_gray,
    borderWidth: 1,
    borderRadius: 12,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderColor: Colors.border_brown,
    borderWidth: 1.5,
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodName: {
    color: Colors.burn,
    fontFamily: "NanumSquareRoundEB",
    fontSize: 24,
    letterSpacing: -0.2,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -2,
    marginBottom: 4,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.background_white,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 0 0 #FDEDC0",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    borderColor: Colors.nurim,
    borderWidth: 1,
    boxShadow: "0 2px 0 0 #FDEDC0",
  },
  categoryText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 12,
    color: Colors.nurim,
  },
  mapContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    borderColor: Colors.light_text_gray,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  placeInfoContainer: {
    position: "absolute",
    bottom: 12,
    left: "4%",
    width: "92%",
    alignItems: "flex-start",
    backgroundColor: Colors.background_white,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 8,
    borderRadius: 16,
    boxShadow: "0 6px 0 0 rgba(204, 204, 204, 0.50)",
  },
  placeName: {
    fontFamily: "NanumSquareEB",
    fontSize: 18,
    color: Colors.burn,
    letterSpacing: 0.6,
  },
  placeAddress: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    color: Colors.slightly_burn,
  },
  distanceContainer: {
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  distanceText: {
    fontFamily: "NanumSquareB",
    fontSize: 14,
    color: Colors.slightly_burn,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background_white,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontFamily: "NanumSquareRoundB",
    fontSize: 13,
    color: Colors.text_gray,
    letterSpacing: -0.4,
    lineHeight: 17,
    textAlign: "center",
  },
});
