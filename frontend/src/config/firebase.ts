// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKOSII-1CZZqEq53tTwwROPjX2cazgqN0",
  authDomain: "luanvan2024-8bb30.firebaseapp.com",
  projectId: "luanvan2024-8bb30",
  storageBucket: "luanvan2024-8bb30.appspot.com",
  messagingSenderId: "572468264586",
  appId: "1:572468264586:web:be74bc5e40190c6a00b773",
  measurementId: "G-KTMJ31WZFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
