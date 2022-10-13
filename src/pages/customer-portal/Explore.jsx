import React, { useEffect, useState, useRef } from 'react';
import { useAuthContext, Hooks } from '@asgardeo/auth-react';
import { useHistory, useLocation } from 'react-router-dom';
import CustomerPortal from '../../templates/CustomerPortal';
import DealsSection from '../../layouts/DealsSection';
import { initiatePhoneVerify } from '../../api';

const Explore = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reRenderCheckRef = useRef(false);
  const {
    on,
    httpRequest,
    signIn,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    getDecodedIDPIDToken
  } = useAuthContext();

  const [decodedIDTokenPayload, setDecodedIDTokenPayload] = useState();

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
    on(Hooks.SignIn, () => {
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

        if (!decodedIDToken.mobileNumberVerified) {
          await handlePhoneVerification();
          history.push('/verify', decodedIDToken);
        }

        console.log(derivedState);
        setDecodedIDTokenPayload(decodedIDToken);
      })();
    });
  }, [on]);

  const handlePhoneVerification = async () => {
    const res = await initiatePhoneVerify(
      decodedIDTokenPayload.userid,
      decodedIDTokenPayload.email,
      decodedIDTokenPayload.phone_number,
      httpRequest
    );
    sessionStorage.setItem('otp', res.otp);
    history.push('/verify', { decodedIDToken: decodedIDTokenPayload });
  };

  return (
    <CustomerPortal>
      <section className="flex flex-col items-start justify-start">
        <div className="w-full pt-6 px-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-4 my-4">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold leading-none text-gray-900">Explore Plans</h3>
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Plan 1</p>
                        <p className="text-sm text-gray-500 truncate">Lorem, ipsum dolor.</p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        $320
                      </div>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Plan 2</p>
                        <p className="text-sm text-gray-500 truncate">Lorem, ipsum dolor.</p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        $240
                      </div>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Plan 3</p>
                        <p className="text-sm text-gray-500 truncate">Lorem, ipsum dolor.</p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        $120
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:p-4 p-2">
          <div className="rounded-lg bg-light p-4">
            <h1>Kfone-Flex</h1>
            <h2>Find out subscriptions for our 4K streaming TV box</h2>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <DealsSection />
      </section>
    </CustomerPortal>
  );
};

export default Explore;
