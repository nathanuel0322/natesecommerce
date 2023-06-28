import React, { createContext, useState } from "react";
import Routing from "./components/global/Routing";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './firebase.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

// change fetch link based on whether in development or production
export const fetchlink = process.env.NODE_ENV === 'production' ? 'https://final-project-1f5v.onrender.com' : 'http://localhost:3001';
export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <Routing />
      <ToastContainer />
    </AuthContext.Provider>
  );
}