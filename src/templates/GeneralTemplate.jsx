import React from 'react';
import Footer from '../layouts/Footer';
import Navbar from '../layouts/Navbar';

const GeneralTemplate = (props) => {
  const { children, handleLogin } = props;

  return (
    <div className="font-body">
      <Navbar handleLogin={handleLogin} />
      {children}
      <Footer />
    </div>
  );
};

export default GeneralTemplate;
