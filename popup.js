// Replace these placeholder values with your Firebase project configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services: Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  // Get references to UI elements
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const nameSection = document.getElementById("nameSection");
  const nameInput = document.getElementById("nameInput");
  const saveNameBtn = document.getElementById("saveNameBtn");

  // Monitor authentication state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      console.log("User signed in:", user.displayName);
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      nameSection.style.display = "block";

      // Retrieve the user's saved name from Firestore
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().name) {
            nameInput.value = doc.data().name;
          } else {
            nameInput.value = "";
            nameInput.placeholder = "type name";
          }
        })
        .catch((error) => {
          console.error("Error retrieving name:", error);
        });
    } else {
      // No user is signed in.
      console.log("No user is signed in.");
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      nameSection.style.display = "none";
    }
  });

  // Sign in with Google
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log("Successfully signed in!", result.user);
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });
  });

  // Sign out
  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  });

  // Save or update the user's name in Firestore
  saveNameBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Please enter a name before saving.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set({ name: name }, { merge: true })
        .then(() => {
          console.log("Name saved successfully.");
        })
        .catch((error) => {
          console.error("Error saving name:", error);
        });
    } else {
      console.error("No authenticated user found.");
    }
  });
});
