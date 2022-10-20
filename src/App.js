import React from 'react';
import AppRouter from './Router';

const App = () => {
  const handleLogin = () => {
    alert('Login functionality is not yet integrated!');
  };

  const handleLogout = () => {
    alert('Logout functionality is not yet integrated!');
  };

  return <AppRouter handleLogin={handleLogin} handleLogout={handleLogout} />;
};

export default App;
