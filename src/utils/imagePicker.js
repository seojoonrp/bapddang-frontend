import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const requestPermissions = async () => {
  const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
  const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return cameraStatus.status === "granted" && mediaStatus.status === "granted";
};

const pickFromLibrary = async ({ setImageUrl }) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.Images,
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled && result.assets.length > 0) {
    setImageUrl(result.assets[0].uri);
  }
};

const takePhoto = async ({ setImageUrl }) => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.Images,
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled && result.assets.length > 0) {
    setImageUrl(result.assets[0].uri);
  }
};

export const pickImage = async ({ setImageUrl }) => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    Alert.alert(
      "권한이 필요합니다",
      "카메라 및 앨범 접근 권한을 허용해주세요."
    );
    return;
  }

  Alert.alert("사진 선택", "어떤 방식으로 사진을 추가할까요?", [
    {
      text: "앨범에서 선택",
      onPress: () => pickFromLibrary({ setImageUrl }),
    },
    {
      text: "카메라로 촬영",
      onPress: () => takePhoto({ setImageUrl }),
    },
    { text: "취소", style: "cancel" },
  ]);
};
