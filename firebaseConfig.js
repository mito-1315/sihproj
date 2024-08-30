// simple-react-native-app/firebase.js

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1pd60JQA5Hkq0A1qdDdoNmBTH6mhWTec",
  authDomain: "cropshop2-23cf0.firebaseapp.com",
  projectId: "cropshop2-23cf0",
  storageBucket: "cropshop2-23cf0.appspot.com",
  messagingSenderId: "444092384634",
  appId: "1:444092384634:web:0fcd11b7655235acb682c3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
const storage = getStorage(firebaseApp);

export { storage };
