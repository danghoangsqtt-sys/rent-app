
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
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

// THAY THẾ ĐOẠN NÀY BẰNG CONFIG CỦA BẠN TỪ FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCll5wdmjMcfHKUkOko4uqTT1kVgfDK01I", 
  authDomain: "rentmasterpro.firebaseapp.com",
  projectId: "rentmasterpro",
  storageBucket: "rentmasterpro.firebasestorage.app",
  messagingSenderId: "564624312294",
  appId: "1:564624312294:web:c942ade3eb5a080672f827"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
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
        isAdmin: false, // Mặc định không phải admin
        createdAt: new Date().toISOString()
      });
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const getUserData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Fix: Added missing export getAllUsers for AdminManagement.tsx
export const getAllUsers = async () => {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => doc.data());
};

// Fix: Added missing export setProStatus for AdminManagement.tsx
export const setProStatus = async (uid: string, status: boolean) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { isPro: status });
};
