import React, { useEffect, useState } from 'react';
import { useAuthContext, Hooks } from '@asgardeo/auth-react';
import { useHistory } from 'react-router-dom';
import { GiCrossedAirFlows } from 'react-icons/gi';
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineCustomerService,
  AiOutlineAppstore,
  AiOutlineCreditCard
} from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';

const CustomerPortal = () => {
  const history = useHistory();
  const { on, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken } = useAuthContext();
  const [decodedIDTokenPayload, setDecodedIDTokenPayload] = useState();

  useEffect(() => {
    console.log(sessionStorage.getItem('isAuth'));
    if (sessionStorage.getItem('isAuth') === null) {
      history.push('/');
      return;
    }

    (async () => {
      const basicUserInfo = await getBasicUserInfo();
      const idToken = await getIDToken();
      const decodedIDToken = await getDecodedIDToken();

      const derivedState = {
        authenticateResponse: basicUserInfo,
        idToken: idToken?.split('.'),
        decodedIdTokenHeader: JSON.parse(atob(idToken?.split('.')[0])),
        decodedIDTokenPayload: decodedIDToken
      };

      console.log(derivedState);
      setDecodedIDTokenPayload(decodedIDToken);
    })();
  }, []);

  useEffect(() => {
    on(Hooks.SignOut, () => {
      console.log('signing out');
      history.push('/');
    });
  }, [on]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuth');
    signOut().catch((e) => {
      console.log(e);
      sessionStorage.setItem('isAuth', true);
    });
  };

  const NavLinkBlock = ({ children }) => {
    return (
      <div className="w-full flex items-center p-4 mb-4 text-secondary text-lg font-light hover:border-r hover:bg-light border-primary-300 hover:text-primary">
        {children}
      </div>
    );
  };

  return (
    <div className="font-body">
      <nav className="fixed top-0 left-0 min-w-[300px] min-h-screen flex flex-col items-start justify-start pt-4 pl-4 bg-white mr-5 overflow-y-auto">
        <div className="flex pb-2 mb-6 w-full">
          <h1 className="flex items-center w-full text-primary text-4xl font-title">
            <GiCrossedAirFlows size={60} />
            <div className="ml-2 flex flex-col justify-start">
              <div>Kfone</div>
              <div className="font-display font-medium text-secondary text-sm">
                Self Service Portal
              </div>
            </div>
          </h1>
        </div>
        <NavLinkBlock>
          <button onClick={handleLogout} className="flex w-full items-center">
            <AiOutlineDashboard size={28} className="mr-3" />
            <h3 className="mr-1">My Plan</h3>
          </button>
        </NavLinkBlock>
        <NavLinkBlock>
          <button onClick={handleLogout} className="flex w-full items-center">
            <AiOutlineAppstore size={28} className="mr-3" />
            <h3 className="mr-1">Discover</h3>
          </button>
        </NavLinkBlock>
        <NavLinkBlock>
          <button onClick={handleLogout} className="flex w-full items-center">
            <AiOutlineCreditCard size={28} className="mr-3" />
            <h3 className="mr-1">Billing</h3>
          </button>
        </NavLinkBlock>
        <NavLinkBlock>
          <button onClick={handleLogout} className="flex w-full items-center">
            <AiOutlineCustomerService size={28} className="mr-3" />
            <h3 className="mr-1">Support</h3>
          </button>
        </NavLinkBlock>
        <NavLinkBlock>
          <a
            href="https://kubecon-c46dd.web.app/"
            target="blank"
            className="flex w-full items-center">
            <AiOutlineUser size={28} className="mr-3" />
            <div className="flex w-full items-start">
              <h3 className="mr-1">My Account</h3>
              <FiExternalLink size={12} />
            </div>
          </a>
        </NavLinkBlock>
        <NavLinkBlock>
          <button onClick={handleLogout} className="flex w-full items-center">
            <AiOutlineLogout size={28} className="mr-3" />
            <h3 className="mr-1">Sign out</h3>
          </button>
        </NavLinkBlock>
      </nav>
      <main className="w-full ml-[300px] my-4 px-4 bg-white overflow-y-auto">
        <section className="flex flex-col items-start justify-start">
          <div className="flex items-center">
            <h1 className="text-secondary-900 font-extralight text-4xl">Hello&nbsp;</h1>
            <div className="px-4 py-2 bg-light rounded-lg">
              <h2 className="text-xl font-light text-primary">{decodedIDTokenPayload?.username}</h2>
              <h2 className="text-sm font-light text-primary-900">
                {decodedIDTokenPayload?.phone_number}
              </h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerPortal;
