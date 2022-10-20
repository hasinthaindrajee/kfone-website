import React, { useEffect, useState } from 'react';
import CustomerPortal from '../../../templates/CustomerPortal';
import { Carousel } from './Carousel';
import { MobilePlans } from './MobilePlans';
import { Phones } from './Phones';
import { IOTDevices } from './IOTDevices';
import { TVPlans } from './TVPlans';
import { useAuthContext } from '@asgardeo/auth-react';
import Loading from '../../../layouts/Loading';
import avatar from '../../../assets/images/people/user.png';

const ExploreWithAuth = (props) => {
  const { state, getDecodedIDToken, signIn, trySignInSilently } = useAuthContext();

  const [decodedIDTokenPayload, setDecodedIDTokenPayload] = useState();

  useEffect(() => {
    if (!state?.isAuthenticated) {
      trySignInSilently()
        .then((response) => {
          if (!response) {
            signIn();
          }
        })
        .catch(() => {
          signIn();
        });
    }

    (async () => {
      const decodedIDToken = await getDecodedIDToken();
      setDecodedIDTokenPayload(decodedIDToken);
    })();
  }, [state.isAuthenticated]);

  if (state?.isLoading) {
    return <Loading />;
  }

  return (
    <CustomerPortal {...props}>
      <div className="flex items-center justify-end w-full mb-5">
        <div className="flex flex-col items-center justify-center mx-4 rounded-full h-[60px] w-[60px] shadow">
          <img src={avatar} alt="user avatar" height={60} />
        </div>
        <div className="px-4 py-2 bg-light rounded-lg shadow">
          <h2 className="text-xl font-light text-primary">{decodedIDTokenPayload?.email || decodedIDTokenPayload?.username }</h2>
          <h2 className="text-sm font-light text-primary-900">
            {decodedIDTokenPayload?.phone_number}
          </h2>
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

export default ExploreWithAuth;
