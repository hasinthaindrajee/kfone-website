import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import ExploreWithAuth from './ExploreWithAuth';
import ExploreWithOutAuth from './ExploreWithOutAuth';

const Explore = (props) => {
  if (!useAuthContext()) {
    return <ExploreWithOutAuth {...props} />;
  }

  return <ExploreWithAuth {...props} />;
};

export default Explore;
