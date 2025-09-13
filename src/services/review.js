import { Alert } from "react-native";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  writeBatch,
  increment,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const createReview = async ({
  name,
  foods,
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

  let createdAt = null;
  if (!createdAt && auth.currentUser?.metadata?.creationTime) {
    createdAt = new Date(auth.currentUser.metadata.creationTime);
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const toLocalStartOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  if (createdAt instanceof Date && !isNaN(createdAt)) {
    const startCreated = toLocalStartOfDay(createdAt);
    const startToday = toLocalStartOfDay(new Date());
    const diffDays = Math.round((startToday - startCreated) / msPerDay);
    day = Math.max(1, diffDays + 1);
  }

  // 테스트할때 day 너무 커지니까 불편해서 그냥 1~7에서 랜덤생성되게 해둠ㅋㅋ
  //day = Math.floor(Math.random() * 7) + 1;
  day=100;

  const week = Math.ceil(day / 7);
  const weekDay = day % 7 === 0 ? 7 : day % 7;

  try {
    const batch = writeBatch(db);
    const newReviewRef = doc(collection(db, "reviews"));
    const reviewData = {
      userId: user.uid,
      name,
      foods,
      time,
      tags,
      imageUrl,
      comment,
      rating,
      day,
      week,
      weekDay,
      createdAt: serverTimestamp(),
    };
    batch.set(newReviewRef, reviewData);

    foods.forEach((foodItem) => {
      if (foodItem.id && !foodItem.isCustom) {
        const foodRef = doc(db, "foods", foodItem.id);
        batch.update(foodRef, { reviewCount: increment(1) });
      }
    });
    
    await batch.commit();

    Alert.alert("리뷰가 생성되었습니다!");
    console.log("리뷰 생성:", newReviewRef.id);
  } catch (error) {
    console.error("리뷰 생성 중 오류 발생:", error);
  }
};

export const editReview = async (reviewId, updatedData) => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("로그인하거라");
    return;
  }

  try {
    const reviewRef = doc(db, "reviews", reviewId);

    await setDoc(reviewRef, updatedData, { merge: true });
    Alert.alert("리뷰가 수정되었습니다!");
  } catch (error) {
    console.error("리뷰 수정 중 오류 발생:", error);
  }
};

export const fetchReviewById = async (reviewId) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      return { id: reviewSnap.id, ...reviewSnap.data() };
    }
  } catch (error) {
    console.error(`리뷰 ${reviewId} 가져오기 중 오류 발생:`, error);
    return null;
  }
};

export const fetchReviewsByWeek = async (week) => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("로그인하거라");
    return;
  }

  try {
    // 현재 주차 계산 로직 현재는 week, weekDay로 나눠둔 상태
    // const user = auth.currentUser;
    // if (!user) return [];

    // const createdAtRaw = user.metadata?.creationTime
    //   ? new Date(user.metadata.creationTime)
    //   : null;
    // if (!(createdAtRaw instanceof Date) || isNaN(createdAtRaw)) return [];

    // const toStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
    // const createdStart = toStart(createdAtRaw);
    // const todayStart = toStart(new Date());
    // const msPerDay = 1000 * 60 * 60 * 24;
    // const diffDays = Math.floor((todayStart - createdStart) / msPerDay);
    // const currentWeek = Math.floor(diffDays / 7) + 1;
    // console.log("Current week:", currentWeek);

    const reviewsRef = collection(db, "reviews");

    const q = query(
      reviewsRef,
      where("userId", "==", user.uid),
      where("week", "==", week),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reviews;
  } catch (error) {
    console.error(`리뷰 가져오기 중 오류 발생:`, error);
    return null;
  }
};
