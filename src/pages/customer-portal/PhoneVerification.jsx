import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { GiCrossedAirFlows } from 'react-icons/gi';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import login_background from '../../assets/images/people/login_background_overlay.jpeg';
import { initiatePhoneVerify, verifyPhone } from '../../api';

const PhoneVerification = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reRenderCheckRef = useRef(false);
  const { signIn, signOut, httpRequest, getDecodedIDPIDToken } = useAuthContext();

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
    if (!location.state || !sessionStorage.getItem('otp')) {
      history.push('/');
      return;
    }

    if (location.state) {
      const decodedIDToken = location.state;
      if (decodedIDToken?.mobileNumberVerified) {
        history.push('/my-kfone');
      }
      setUserId(decodedIDToken?.userid);
      setEmail(decodedIDToken?.email);
      setPhone(decodedIDToken?.phone_number);
      return;
    }
  }, []);

  const handleInitiate = async () => {
    const res = await initiatePhoneVerify(userId, email, phone, httpRequest);
    sessionStorage.setItem('otp', res.otp);
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

    verifyPhone(userId, email, phone, httpRequest)
      .then((res) => {
        console.log(res);
        setLoading(false);
        signOut();
        // signIn().then(() => {
        //   window.location.replace('/my-kfone');
        // });
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
          <h3 className="text-2xl my-3">Verify Your Mobile</h3>
          <div className="mt-4 w-[60%]">
            <div className="py-2 flex flex-col items-start w-full">
              <label className="mb-1 text-sm" htmlFor="otp">
                We sent a verification code to your phone ending with&nbsp;
                {phone.substring(phone.length - 4)}
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
