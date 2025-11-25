import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4r_NwQ-wNnXYx7IqeqB8EfdM7hJyX5Ao",
  authDomain: "fir-authentication-5aa90.firebaseapp.com",
  projectId: "fir-authentication-5aa90",
  storageBucket: "fir-authentication-5aa90.firebasestorage.app",
  messagingSenderId: "78293604872",
  appId: "1:78293604872:web:20721c2c0ad51d4a61cfbd"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
