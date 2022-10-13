import React, { useEffect, useState, useRef } from 'react';
import { useAuthContext, Hooks } from '@asgardeo/auth-react';
import { useHistory, useLocation } from 'react-router-dom';
import CustomerPortal from '../../templates/CustomerPortal';
import { initiatePhoneVerify } from '../../api';

const Discover = () => {
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
        <div className="flex items-center">
          <h1 className="text-secondary-900 font-extralight text-4xl">Discover</h1>
        </div>
      </section>
    </CustomerPortal>
  );
};

export default Discover;
