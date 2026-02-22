
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webbuilderai-528c1.firebaseapp.com",
  projectId: "webbuilderai-528c1",
  storageBucket: "webbuilderai-528c1.firebasestorage.app",
  messagingSenderId: "409697901644",
  appId: "1:409697901644:web:b9f5b429f9af603e6728e9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider}



