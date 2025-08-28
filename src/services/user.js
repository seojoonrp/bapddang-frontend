import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  increment,
  documentId,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCredential.user);

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error creating user:", error);

    return { success: false, error: error.message };
  }
};

export const createUserDocument = async (user) => {
  const userDocRef = doc(db, "users", user.uid);

  try {
    await setDoc(userDocRef, {
      userName: "username",
      email: user.email,
      likedFoodIds: [],
      recentFoodIds: [],
      createdAt: serverTimestamp(),
    });
    console.log("Successfully created user document:", user.email);
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};

export const userLikeFood = async (userId, foodId) => {
  const batch = writeBatch(db);

  const userDocRef = doc(db, "users", userId);
  const foodDocRef = doc(db, "foods", foodId);

  try {
    batch.update(userDocRef, {
      likedFoodIds: arrayUnion(foodId),
    });

    batch.update(foodDocRef, {
      likeCount: increment(1),
    });

    await batch.commit();

    console.log(`Successfully liked food: ${foodId} by user: ${userId}`);
  } catch (error) {
    console.error("Error liking food:", error);
  }
};

export const fetchLikedFoodNames = async (userId) => {
  const userDocRef = doc(db, "users", userId);

  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const likedFoodIds = userData.likedFoodIds || [];
      if (likedFoodIds.length === 0) return [];

      const foodsRef = collection(db, "foods");
      const q = query(foodsRef, where(documentId(), "in", likedFoodIds));
      const querySnapshot = await getDocs(q);

      const likedFoodNames = querySnapshot.docs.map((doc) => doc.data().name);
      return likedFoodNames;
    } else {
      console.log("No such user document!");
      return [];
    }
  } catch (error) {
    console.error("Error fetching liked foods:", error);
    return [];
  }
};
