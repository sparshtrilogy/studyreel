import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZuRv2rDZJN_jr8t984vNGqAThyk1AHus",
  authDomain: "studyreel-21716.firebaseapp.com",
  projectId: "studyreel-21716",
  storageBucket: "studyreel-21716.appspot.com",
  messagingSenderId: "101544454160",
  appId: "1:101544454160:web:60aee6fd05272b4ad7c295",
  measurementId: "G-DPM5S4NJ9Z"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);