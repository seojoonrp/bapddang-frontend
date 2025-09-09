import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const fetchFoods = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "foods"));

    const foodsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return foodsData;
  } catch (error) {
    console.error("Error fetching foods:", error);
    return [];
  }
};

export const fetchFoodById = async (foodId) => {
  try {
    const docRef = doc(db, "foods", foodId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("Food not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    return null;
  }
};

/*
  음식 이름 배열 받아서
  foods 컬렉션에 있으면 { id, false } 반환
  없으면 customFoods 컬렉션에서 탐색/생성 후 { id, true } 반환
*/
export const classifyFoodNameArray = async (foodNames) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("로그인하거라");
    return [];
  }

  try {
    const foodsRef = collection(db, "foods");
    const customFoodsRef = collection(db, "customFoods");

    const classificationPromises = foodNames.map(async (name) => {
      const foodQuery = query(foodsRef, where("name", "==", name));
      const foodSnapshot = await getDocs(foodQuery);

      if (!foodSnapshot.empty) {
        const foodDoc = foodSnapshot.docs[0];
        return { id: foodDoc.id, isCustom: false };
      } else {
        const customFoodQuery = query(
          customFoodsRef,
          where("name", "==", name),
          where("userId", "==", user.uid)
        );
        const customFoodSnapshot = await getDocs(customFoodQuery);

        if (!customFoodSnapshot.empty) {
          const customFoodDoc = customFoodSnapshot.docs[0];
          return { id: customFoodDoc.id, isCustom: true };
        } else {
          const newCustomFood = {
            userId: user.uid,
            name,
            createdAt: new Date(),
          };

          const docRef = await addDoc(customFoodsRef, newCustomFood);
          return { id: docRef.id, isCustom: true };
        }
      }
    });

    const results = await Promise.all(classificationPromises);
    return results;
  } catch (error) {
    console.error("Error classifying food names:", error);
    return [];
  }
};
