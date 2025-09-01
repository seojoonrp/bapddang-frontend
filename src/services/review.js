import { Alert, Platform } from "react-native";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";

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

    const reviewData = {
      userId: user.uid,
      foodId,
      time,
      tags,
      imageUrl,
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
