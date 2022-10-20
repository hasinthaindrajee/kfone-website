import React from 'react';
import CustomerPortal from '../../../templates/CustomerPortal';
import { Carousel } from './Carousel';
import { MobilePlans } from './MobilePlans';
import { Phones } from './Phones';
import { IOTDevices } from './IOTDevices';
import { TVPlans } from './TVPlans';
import avatar from '../../../assets/images/people/user.png';

const ExploreWithAuthOutAuth = () => {
  return (
    <CustomerPortal>
      <div className="flex items-center justify-end w-full mb-5">
        <div className="flex flex-col items-center justify-center mx-4 rounded-full h-[60px] w-[60px] shadow">
          <img src={avatar} alt="user avatar" height={60} />
        </div>
        <div className="px-4 py-2 bg-light rounded-lg shadow">
          <h2 className="text-xl font-light text-primary">unknown</h2>
          <h2 className="text-sm font-light text-primary-900">unknown</h2>
        </div>
      </div>
      <Carousel />
      <MobilePlans />
      <Phones />
      <TVPlans />
      <IOTDevices />
    </CustomerPortal>
  );
};

export default ExploreWithAuthOutAuth;
