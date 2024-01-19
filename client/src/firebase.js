import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "karmpal-s-blog.firebaseapp.com",
  projectId: "karmpal-s-blog",
  storageBucket: "karmpal-s-blog.appspot.com",
  messagingSenderId: "792474389900",
  appId: "1:792474389900:web:97f0e3b44d261215759aa9",
};

export const app = initializeApp(firebaseConfig);
