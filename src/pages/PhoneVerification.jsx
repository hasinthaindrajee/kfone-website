import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { GiCrossedAirFlows } from 'react-icons/gi';
import PrimaryButton from '../components/buttons/PrimaryButton';
import login_background from '../assets/images/people/login_background_overlay.jpeg';

const PhoneVerification = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reRenderCheckRef = useRef(false);
  const { signIn, httpRequest, getDecodedIDPIDToken } = useAuthContext();

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

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
        history.push('/');
      }
    })();
  }, []);

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      const { decodedIDToken } = location.state;
      console.log(decodedIDToken);
      setUserId(decodedIDToken?.userid);
      setEmail(decodedIDToken?.email);
      setPhone(decodedIDToken?.phone_number);
      return;
    }
    // if (sessionStorage.getItem('otp') === null || sessionStorage.getItem('otp').length < 1) {
    //   handleInitiate();
    // }
  }, []);

  const handleInitiate = async () => {
    const requestConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json'
      },
      method: 'POST',
      data: {
        userId: userId,
        email: email,
        mobile: phone
      },
      url: 'https://42807e1f-07ba-4fb0-a6d2-ecc7b41dd143-prod.e1-us-east-azure.choreoapis.dev/yphf/user-registration/1.0.0/initiate'
    };

    return httpRequest(requestConfig)
      .then((response) => {
        console.log(response);
        sessionStorage.setItem('otp', response.data.otp);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const validateUserInput = (code) => {
    if (typeof code !== 'string') {
      return false;
    }

    const num = Number(code);

    if (Number.isInteger(num) && num > 0 && code.length === 6) {
      return true;
    }

    return false;
  };

  const handleVerify = async () => {
    setLoading(true);
    setTimeout(() => {
      if (!validateUserInput(otp)) {
        // TODO: handle error
        setLoading(false);
        return;
      }
      if (otp !== sessionStorage.getItem('otp')) {
        // TODO: handle error
        setLoading(false);
        return;
      }
    }, 3000);

    const requestConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json'
      },
      method: 'POST',
      data: {
        userId: userId,
        email: email,
        mobile: phone
      },
      url: 'https://42807e1f-07ba-4fb0-a6d2-ecc7b41dd143-prod.e1-us-east-azure.choreoapis.dev/yphf/user-registration/1.0.0/verify'
    };

    return httpRequest(requestConfig)
      .then((response) => {
        console.log(response);
        setLoading(false);
        history.push('/my-kfone');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <main className="grid grid-cols-1 md:grid-cols-3 font-body">
        <div
          className="col-span-2 hidden md:block md:min-h-screen bg-right bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${login_background})`
          }}></div>
        <div className="flex flex-col h-screen w-full justify-center items-center">
          <div className="text-center">
            <h1 className="flex items-center w-full text-primary text-4xl font-title">
              <GiCrossedAirFlows size={60} />
            </h1>
          </div>
          <h3 className="text-2xl my-3">Verify Phone</h3>
          <div className="mt-4 w-[60%]">
            <div className="py-2 flex flex-col items-start w-full">
              <label className="mb-1 text-sm" htmlFor="otp">
                Code is sent to the phone number ending with {phone.substring(phone.length - 4)}
              </label>
              <input
                className="border border-secondary-100 rounded p-2 w-full focus-visible:outline-primary-50"
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="mt-4 w-[60%]">
            <PrimaryButton
              text={loading ? 'Verifying...' : 'Verify'}
              disabled={loading}
              styles="w-full justify-center"
              onClick={handleVerify}
            />
            <p className="text-sm mt-2">
              Didn&apos;t receive the code?&nbsp;
              <a
                className="cursor-pointer hover:underline text-secondary-500 hover:text-primary-400"
                onClick={handleInitiate}>
                Request again
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default PhoneVerification;
