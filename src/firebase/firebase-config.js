// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD69oR9gUoXn5cQ2NhgxH3tYBTwHWprwvk",
    authDomain: "its-stones.firebaseapp.com",
    projectId: "its-stones",
    storageBucket: "its-stones.firebasestorage.app",
    messagingSenderId: "583641574316",
    appId: "1:583641574316:web:4660dffc29f03f7727a809",
    measurementId: "G-XTCEC8LVJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {app, analytics};