import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAw1rEuG0Qqq2IOXnsK1RiGctytf0J7BL4",
  authDomain: "sample-3e6d9.firebaseapp.com",
  projectId: "sample-3e6d9",
  storageBucket: "sample-3e6d9.firebasestorage.app",
  messagingSenderId: "457727079794",
  appId: "1:457727079794:web:428c9be49f62e08d0a99eb",
  measurementId: "G-CFXVLWVYJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };