// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDJZ6y31RdB7v-fqQgmQPrJ8YPhcbAGzCw",
  authDomain: "electricpayment-d6f1a.firebaseapp.com",
  projectId: "electricpayment-d6f1a",
  storageBucket: "electricpayment-d6f1a.appspot.com",
  messagingSenderId: "941041979763",
  appId: "1:941041979763:web:cfbf3092aba9db641e3506",
  measurementId: "G-5ZYQCTXVN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
