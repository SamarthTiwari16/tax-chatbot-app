// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgcyhzsOBCD8Ce_96JfLjbnIC6jJpWtsI",
  authDomain: "ai-tax-assistant-5418d.firebaseapp.com",
  projectId: "ai-tax-assistant-5418d",
  storageBucket: "ai-tax-assistant-5418d.firebasestorage.app",
  messagingSenderId: "653583228597",
  appId: "1:653583228597:web:8895b167cc63e13cd028fc",
  measurementId: "G-7Y6D09ETF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);