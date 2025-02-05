// Import the Firebase modules from the npm package
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCcwOXhQaQyEPnz3Zupk5seh_gj7wMpX-c",
    authDomain: "fireauth-55792.firebaseapp.com",
    projectId: "fireauth-55792",
    storageBucket: "fireauth-55792.firebasestorage.app",
    messagingSenderId: "487701880290",
    appId: "1:487701880290:web:e812bfefd2adc3fc60edbb",
    measurementId: "G-8NBZZK6NK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // Get UI elements
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const nameSection = document.getElementById("nameSection");
  const nameInput = document.getElementById("nameInput");
  const saveNameBtn = document.getElementById("saveNameBtn");

  // Monitor auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User signed in:", user.displayName);
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      nameSection.style.display = "block";

      // Retrieve the user's saved name from Firestore
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().name) {
          nameInput.value = docSnap.data().name;
        } else {
          nameInput.value = "";
          nameInput.placeholder = "type name";
        }
      } catch (error) {
        console.error("Error retrieving name:", error);
      }
    } else {
      console.log("No user is signed in.");
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      nameSection.style.display = "none";
    }
  });

  // Sign in with Google
  loginBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Successfully signed in!", result.user.displayName);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  });

  // Sign out
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User signed out.");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  });

  // Save or update the user's name in Firestore
  saveNameBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Please enter a name before saving.");
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { name: name }, { merge: true });
        console.log("Name saved successfully.");
      } catch (error) {
        console.error("Error saving name:", error);
      }
    } else {
      console.error("No authenticated user found.");
    }
  });
});
