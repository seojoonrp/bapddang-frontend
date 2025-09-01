import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

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
