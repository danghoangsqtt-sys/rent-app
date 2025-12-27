
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc 
} from "firebase/firestore";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCll5wdmjMcfHKUkOko4uqTT1kVgfDK01I",
  authDomain: "rentmasterpro.firebaseapp.com",
  projectId: "rentmasterpro",
  storageBucket: "rentmasterpro.firebasestorage.app",
  messagingSenderId: "564624312294",
  appId: "1:564624312294:web:c942ade3eb5a080672f827",
  measurementId: "G-5H600858F7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Đăng nhập bằng Google
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isPro: false,
        isAdmin: false,
        createdAt: new Date().toISOString()
      });
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

export function logout() {
  return signOut(auth);
}

export async function getUserData(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

export async function getAllUsers() {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => doc.data());
}

export async function setProStatus(uid: string, status: boolean) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { isPro: status });
}
