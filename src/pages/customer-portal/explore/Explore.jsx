import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import ExploreWithAuth from './ExploreWithAuth';
import ExploreWithOutAuth from './ExploreWithOutAuth';

const Explore = () => {
  if (!useAuthContext()) {
    return <ExploreWithOutAuth />;
  }

  return <ExploreWithAuth />;
};

export default Explore;
