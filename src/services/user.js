import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
