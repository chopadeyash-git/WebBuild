// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webai-7e6c4.firebaseapp.com",
  projectId: "webai-7e6c4",
  storageBucket: "webai-7e6c4.firebasestorage.app",
  messagingSenderId: "987210097765",
  appId: "1:987210097765:web:8a9fa25fa1df87b478928c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}

