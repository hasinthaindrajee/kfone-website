import React from 'react';
import CustomerPortal from '../../../templates/CustomerPortal';
import { Carousel } from './Carousel';
import { MobilePlans } from './MobilePlans';
import { Phones } from './Phones';
import { IOTDevices } from './IOTDevices';
import { TVPlans } from './TVPlans';
import { useAuthContext } from '@asgardeo/auth-react';
import Loading from '../../../layouts/Loading';

const ExploreWithAuth = () => {
  const { state } = useAuthContext();
  const { isAuthenticated, isLoading } = state;

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <CustomerPortal>
      <Carousel />
      <MobilePlans />
      <Phones />
      <TVPlans />
      <IOTDevices />
    </CustomerPortal>
  );
};

export default ExploreWithAuth;
