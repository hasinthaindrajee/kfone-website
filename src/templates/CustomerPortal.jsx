import React from 'react';
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
import Config from '../config.json';

const CustomerPortal = ({ children }) => {
  const location = useLocation();
  const history = useHistory();

  const handleLogout = () => {
    return;
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
            <AiOutlineAppstore size={28} className="mr-3" />
            <h3 className="mr-1">Explore</h3>
          </button>
        </NavLinkBlock>
        <NavLinkBlock url="/my-kfone/my-plan">
          <button className="flex w-full items-center">
            <AiOutlineDashboard size={28} className="mr-3" />
            <h3 className="mr-1">My Plan</h3>
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
          <button
            onClick={() => {
              sessionStorage.removeItem('verified');
              sessionStorage.removeItem('otp');
              handleLogout();
            }}
            className="flex w-full items-center">
            <AiOutlineLogout size={28} className="mr-3" />
            <h3 className="mr-1">Sign out</h3>
          </button>
        </NavLinkBlock>
      </nav>
      <main className="ml-[300px] overflow-y-auto h-screen bg-gray-100 p-4">{children}</main>
    </div>
  );
};

export default CustomerPortal;
