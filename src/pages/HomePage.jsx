import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import HomePageWithAuth from './HomePageWithAuth';
import HomePageWithOutAuth from './HomePageWithOutAuth';

const HomePage = () => {
  if (!useAuthContext()) {
    return <HomePageWithOutAuth />;
  }

  return <HomePageWithAuth />;
};

export default HomePage;
