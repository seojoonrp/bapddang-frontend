import { Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { storage } from "@react-native-firebase/storage";

export const createReview = async ({
  foodId,
  time,
  tags,
  imageUrl,
  comment,
  rating,
}) => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("로그인하거라");
    return;
  }

  let day = 1;

  // let createdAt = null;
  // if (!createdAt && auth.currentUser?.metadata?.creationTime) {
  //   createdAt = new Date(auth.currentUser.metadata.creationTime);
  // }

  // const msPerDay = 1000 * 60 * 60 * 24;
  // const toLocalStartOfDay = (d) => {
  //   const x = new Date(d);
  //   x.setHours(0, 0, 0, 0);
  //   return x;
  // };

  // if (createdAt instanceof Date && !isNaN(createdAt)) {
  //   const startCreated = toLocalStartOfDay(createdAt);
  //   const startToday = toLocalStartOfDay(new Date());
  //   const diffDays = Math.round((startToday - startCreated) / msPerDay);
  //   day = Math.max(1, diffDays + 1);
  // }

  try {
    let finalImageUrl = null;

    if (imageUrl) {
      const uploadedUrl = await uploadImageAndGetURL(imageUrl, user.uid);
      if (!uploadedUrl) {
        console.log("이미지 업로드 실패");
      }
      finalImageUrl = uploadedUrl;
    }

    const reviewData = {
      userId: user.uid,
      foodId,
      time,
      tags,
      imageUrl: finalImageUrl,
      comment,
      rating,
      day, // TODO : day 계산 맞는지 체크
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reviews"), reviewData);

    Alert.alert("리뷰가 생성되었습니다!");
    console.log("리뷰 생성:", docRef.id);
  } catch (error) {
    console.error("리뷰 생성 중 오류 발생:", error);
  }
};

export const editReview = async (reviewId, updatedData) => {
  // 어쩌고저쩌고
};

export const fetchReviews = async (day) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("day", "==", day));
    const querySnapshot = await getDocs(q);

    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Fetched ${reviews.length} reviews for day ${day}`);
    return reviews;
  } catch (error) {
    console.error("리뷰 가져오기 중 오류 발생:", error);
    return [];
  }
};

export const uploadImageAndGetURL = async (uri, userId) => {
  try {
    const { base64 } = await manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }], // 필요시 800~1280 사이로 조절
      { compress: 0.65, format: SaveFormat.JPEG, base64: true }
    );

    if (!base64) throw new Error("manipulateAsync did not return base64");

    const path = `reviews/${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, path);

    // 핵심: data_url 문자열로 업로드 (Expo Go에서 가장 안전)
    await uploadString(
      storageRef,
      `data:image/jpeg;base64,${base64}`,
      "data_url"
    );

    return await getDownloadURL(storageRef);
  } catch (e) {
    console.log(
      "Storage error:",
      e.code,
      e.message,
      e.customData?.serverResponse
    );
    return null;
  }
};
