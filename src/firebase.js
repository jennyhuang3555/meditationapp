import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 
const firebaseConfig = {
  apiKey: "AIzaSyBjCGDwoCNOnAXEn8-3cviwU9o3wC2uV_g",
  authDomain: "meditationapp-484fc.firebaseapp.com",
  projectId: "meditationapp-484fc",
  storageBucket: "meditationapp-484fc.appspot.com",
  messagingSenderId: "816648817051",
  appId: "1:816648817051:web:75ee22283fdf38564c793e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);    

console.log('Firebase initialized with config:', firebaseConfig);