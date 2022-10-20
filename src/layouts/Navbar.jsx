import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import NavbarWithOutAuth from './NavbarWithOutAuth';
import NavbarWithAuth from './NavbarWithAuth';

const Navbar = (props) => {

  if (!useAuthContext()) {
    return <NavbarWithOutAuth {...props} />;
  }

  return <NavbarWithAuth {...props} />;
};

export default Navbar;
