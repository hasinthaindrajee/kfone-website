import React from 'react';
import AppRouter from './Router';
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
 const { state, signIn, signOut } = useAuthContext();

const handleLogin = () => {
  signIn();
 };

 const handleLogout = () => {
   signOut();
 };


  return <AppRouter handleLogin={handleLogin} handleLogout={handleLogout} />;
};

export default App;
