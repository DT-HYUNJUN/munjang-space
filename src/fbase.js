import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDB3m7Itah0hTv4PzVCADnhVEdT7zk0lQ",
  authDomain: "react-project-c473a.firebaseapp.com",
  projectId: "react-project-c473a",
  storageBucket: "react-project-c473a.appspot.com",
  messagingSenderId: "522668720564",
  appId: "1:522668720564:web:0a9e6fcac902e1fbbd32e1",
};

initializeApp(firebaseConfig);

export const authService = getAuth();
