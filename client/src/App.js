import React, { createContext, useState } from "react";
import Routing from "./components/global/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

// change fetch link based on whether in development or production
export const fetchlink = process.env.NODE_ENV === 'production' ? 'https://natescommerce.onrender.com' : 'http://localhost:3001';
export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <Routing />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthContext.Provider>
  );
}