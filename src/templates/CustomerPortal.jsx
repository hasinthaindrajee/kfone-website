import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useHistory, useLocation } from 'react-router-dom';
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
import Loading from '../layouts/Loading';
import Config from '../config.json';

const CustomerPortal = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const reRenderCheckRef = useRef(false);
  const { state, signIn, signOut, getDecodedIDPIDToken } = useAuthContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reRenderCheckRef.current = true;

    (async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const decodedIDtoken = await getDecodedIDPIDToken();
        const expiration = decodedIDtoken?.exp;
        if (now < expiration && !query.get('code')) {
          await signIn();
        }
      } catch (error) {
        console.log(error);
        if (error?.code === 'SPA-AUTH_CLIENT-VM-IV02' && !query.get('code')) {
          await signIn();
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!state?.isAuthenticated) {
      return;
    }

    setLoading(false);
  }, [state.isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('verified');
    sessionStorage.removeItem('otp');
    signOut();
  };

  const NavLinkBlock = (props) => {
    const { children, url } = props;

    const active = url === location?.pathname;

    return (
      <div
        className={`w-full flex items-center p-4 mb-4 text-lg font-light hover:border-r hover:bg-light border-primary-300 hover:text-primary ${
          active ? 'bg-light border-r  border-primary-300  text-primary' : 'text-secondary'
        }`}>
        {children}
      </div>
    );
  };

  return (
    <>
      {!loading ? (
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
            <NavLinkBlock url="/my-kfone">
              <button
                onClick={() => {
                  history.push('/my-kfone');
                }}
                className="flex w-full items-center">
                <AiOutlineDashboard size={28} className="mr-3" />
                <h3 className="mr-1">My Plan</h3>
              </button>
            </NavLinkBlock>
            <NavLinkBlock url="/my-kfone/explore">
              <button
                onClick={() => {
                  history.push('/my-kfone/explore');
                }}
                className="flex w-full items-center">
                <AiOutlineAppstore size={28} className="mr-3" />
                <h3 className="mr-1">Explore</h3>
              </button>
            </NavLinkBlock>
            <NavLinkBlock url="/my-kfone/billing">
              <button onClick={() => {}} className="flex w-full items-center">
                <AiOutlineCreditCard size={28} className="mr-3" />
                <h3 className="mr-1">Billing</h3>
              </button>
            </NavLinkBlock>
            <NavLinkBlock url="/support">
              <button onClick={() => {}} className="flex w-full items-center">
                <AiOutlineCustomerService size={28} className="mr-3" />
                <h3 className="mr-1">Support</h3>
              </button>
            </NavLinkBlock>
            <NavLinkBlock url="">
              <a href={Config.myaccount} target="blank" className="flex w-full items-center">
                <AiOutlineUser size={28} className="mr-3" />
                <div className="flex w-full items-start">
                  <h3 className="mr-1">My Account</h3>
                  <FiExternalLink size={12} />
                </div>
              </a>
            </NavLinkBlock>
            <NavLinkBlock url="">
              <button onClick={handleLogout} className="flex w-full items-center">
                <AiOutlineLogout size={28} className="mr-3" />
                <h3 className="mr-1">Sign out</h3>
              </button>
            </NavLinkBlock>
          </nav>
          <main className="ml-[300px] overflow-y-auto bg-gray-100 p-4">{children}</main>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default CustomerPortal;
