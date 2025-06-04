// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
// import { Await } from "react-router-dom";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNsWZRBbbrpZ3XwYNRn-mi44j4C-Y4pUU",
  authDomain: "chat-app-af7c5.firebaseapp.com",
  projectId: "chat-app-af7c5",
  storageBucket: "chat-app-af7c5.firebasestorage.app",
  messagingSenderId: "59244727219",
  appId: "1:59244727219:web:6341fdd4d0125b42e499c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    let user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "hey , i am using chat App",
      lastseen: Date.now()
    })



    await setDoc(doc(db, "chats", user.uid), {
      chatData: []
    })

  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("enter your email")
    return null;
  }
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querysnap = await getDocs(q);
    if (!querysnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("reset email send");
    } else {
      toast.error("email does not exist");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message)
  }
}
export { signup, login, logout, auth, db, resetPass }