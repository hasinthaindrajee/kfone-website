import React from 'react';
import Footer from '../layouts/Footer';
import Navbar from '../layouts/Navbar';

const WebPage = (props) => {
  const { children, handleLogin, state } = props;
  return (
    <div className="font-body">
      <Navbar handleLogin={handleLogin} state={state} />
      {children}
      <Footer />
    </div>
  );
};

export default WebPage;
