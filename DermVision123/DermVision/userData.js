import { ref, get, child } from "firebase/database";
import { firebase_db, firebase_auth } from "./firebaseConfig";

export const fetchUserData = async () => {
  try {
    const userId = firebase_auth.currentUser.uid;
    const userRef = ref(firebase_db, `users/${userId}`);
    const snapshot = await get(child(userRef, "/"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available for this user");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};