import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  documentId,
  collection,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment,
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
  const userDocRef = doc(db, "users", userId);
  const foodDocRef = doc(db, "foods", foodId);
  const batch = writeBatch(db);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      throw new Error("User document does not exist!");
    }

    const userData = userDoc.data();
    const isAlreadyLiked = userData.likedFoodIds?.includes(foodId);

    if (isAlreadyLiked) {
      batch.update(userDocRef, {
        likedFoodIds: arrayRemove(foodId),
      });
      batch.update(foodDocRef, {
        likeCount: increment(-1),
      });
      console.log(`Successfully UNLIKED food: ${foodId} by user: ${userId}`);
    } else {
      batch.update(userDocRef, {
        likedFoodIds: arrayUnion(foodId),
      });
      batch.update(foodDocRef, {
        likeCount: increment(1),
      });
      console.log(`Successfully LIKED food: ${foodId} by user: ${userId}`);
    }

    await batch.commit();
  } catch (error) {
    console.error("Error toggling like for food:", error);
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

export const listenToLikedFoods = (userId, callback) => {
  const userDocRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(userDocRef, async (userDoc) => {
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const likedFoodIds = userData.likedFoodIds || [];

      if (likedFoodIds.length === 0) {
        callback([]);
        return;
      }

      const foodsRef = collection(db, "foods");
      const q = query(foodsRef, where(documentId(), "in", likedFoodIds));
      const querySnapshot = await getDocs(q);

      const likedFoods = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      callback(likedFoods);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error listening to liked foods:", error);
    callback([]);
  });

  return unsubscribe;
};