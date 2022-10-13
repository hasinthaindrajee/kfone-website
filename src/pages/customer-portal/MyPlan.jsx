import React, { useEffect, useState, useRef } from 'react';
import { useAuthContext, Hooks } from '@asgardeo/auth-react';
import { useHistory, useLocation } from 'react-router-dom';
import CustomerPortal from '../../templates/CustomerPortal';
import { initiatePhoneVerify } from '../../api';
import { BsBookmarkStar, BsCheck } from 'react-icons/bs';

const currentYear = new Date().getFullYear();

const MyPlan = () => {
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

        console.log(derivedState);
        setDecodedIDTokenPayload(decodedIDToken);

        if (!decodedIDToken.mobileNumberVerified) {
          handlePhoneVerification(
            decodedIDToken.userid,
            decodedIDToken.email,
            decodedIDToken.phone_number
          ).then(() => {
            history.push('/my-kfone/verify', decodedIDToken);
          });
        }
      })();
    });
  }, [on]);

  const handlePhoneVerification = async (userid, email, phone_number) => {
    const res = await initiatePhoneVerify(userid, email, phone_number, httpRequest);
    sessionStorage.setItem('otp', res.otp);
    history.push('/verify', { decodedIDToken: decodedIDTokenPayload });
  };

  return (
    <CustomerPortal>
      <section className="flex flex-col items-start justify-start">
        <div className="flex items-center justify-end w-full">
          <div className="flex flex-col items-center justify-center bg-primary-100 p-4 mx-2 rounded-full h-20 w-20 shadow">
            <h1 className="text-light font-semibold text-5xl uppercase">
              {decodedIDTokenPayload?.username.substring(0, 1)}
            </h1>
          </div>
          <div className="px-4 py-2 bg-light rounded-lg shadow">
            <h2 className="text-xl font-light text-primary">{decodedIDTokenPayload?.username}</h2>
            <h2 className="text-sm font-light text-primary-900">
              {decodedIDTokenPayload?.phone_number}
            </h2>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-4 my-4">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">My Plan</h3>
            <div className="border rounded-lg p-4">
              <h1 className="flex items-center font-light text-xl text-primary">
                <BsBookmarkStar className="text-primary-200 mr-2" size={32} />
                Kfone Emerald Plan
              </h1>
              <table className="items-center bg-transparent border-collapse w-full">
                <tbody className="divide-y divide-gray-100">
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      <BsCheck className="inline text-emerald-400 mr-2" size={24} />
                      100 GB max speed data
                    </th>
                  </tr>
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      <BsCheck className="inline text-emerald-400 mr-2" size={24} />
                      1000 minutes of standard national calls
                    </th>
                  </tr>
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      <BsCheck className="inline text-emerald-400 mr-2" size={24} />
                      Unlimited text
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
              Buy Data Addons & Subscriptions
            </h3>
            <table className="items-center w-full bg-transparent border-collapse">
              <tbody className="divide-y divide-gray-100">
                <tr className="text-gray-500">
                  <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                    Data
                  </th>
                  <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                    5,649
                  </td>
                  <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-xs font-medium">30%</span>
                      <div className="relative w-full">
                        <div className="w-full bg-gray-200 rounded-sm h-2">
                          <div
                            className="bg-cyan-600 h-2 rounded-sm"
                            style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="text-gray-500">
                  <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                    Talk
                  </th>
                  <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                    4,025
                  </td>
                  <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-xs font-medium">24%</span>
                      <div className="relative w-full">
                        <div className="w-full bg-gray-200 rounded-sm h-2">
                          <div
                            className="bg-orange-300 h-2 rounded-sm"
                            style={{ width: '24%' }}></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="text-gray-500">
                  <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                    Text
                  </th>
                  <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                    3,105
                  </td>
                  <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-xs font-medium">18%</span>
                      <div className="relative w-full">
                        <div className="w-full bg-gray-200 rounded-sm h-2">
                          <div
                            className="bg-teal-400 h-2 rounded-sm"
                            style={{ width: '18%' }}></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-4 my-4">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
              Current Usage
              <span className="text-sm font-light">
                &nbsp; as of {new Date().toLocaleString('en-US')}
              </span>
            </h3>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                {/* <thead>
                  <tr>
                    <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                      Top Channels
                    </th>
                    <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                      Users
                    </th>
                    <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap min-w-140-px"></th>
                  </tr>
                </thead> */}
                <tbody className="divide-y divide-gray-100">
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      Data
                    </th>
                    <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                      5,649
                    </td>
                    <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">30%</span>
                        <div className="relative w-full">
                          <div className="w-full bg-gray-200 rounded-sm h-2">
                            <div
                              className="bg-primary-100 h-2 rounded-sm"
                              style={{ width: '30%' }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      Talk
                    </th>
                    <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                      4,025
                    </td>
                    <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">24%</span>
                        <div className="relative w-full">
                          <div className="w-full bg-gray-200 rounded-sm h-2">
                            <div
                              className="bg-primary-100 h-2 rounded-sm"
                              style={{ width: '24%' }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="text-gray-500">
                    <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                      Text
                    </th>
                    <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                      3,105
                    </td>
                    <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium">18%</span>
                        <div className="relative w-full">
                          <div className="w-full bg-gray-200 rounded-sm h-2">
                            <div
                              className="bg-primary-100 h-2 rounded-sm"
                              style={{ width: '18%' }}></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Payments</h3>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline rounded-lg p-2">
                  View all
                </a>
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <div className="overflow-x-auto rounded-lg">
                <div className="align-middle inline-block min-w-full">
                  <div className="shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            Aug 23 ,{currentYear}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            $590
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            Jul 20 ,{currentYear}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            $2300
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            May 18 ,{currentYear}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            $234
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 xl:gap-4 my-4">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Usage History</h3>
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <div className="overflow-x-auto rounded-lg">
                <div className="align-middle inline-block min-w-full">
                  <div className="shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usage
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Additional Purchases & Usage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            September 2022
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            100.0GB
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            10.0GB/10.0GB
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            August 2022
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            100.0GB
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            <span className="bg-light rounded border border-secondary-50 inline-block p-1 mr-1">
                              10.0GB/10.0GB
                            </span>
                            <span className="bg-light rounded border border-secondary-50 inline-block p-1">
                              8.0GB/10.0GB
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            July 2022
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            100.0GB
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            10.0GB/10.0GB
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-3 xl:gap-4 my-4">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0">
                <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                  $45,385
                </span>
                <h3 className="text-base font-normal text-gray-500">Sales this week</h3>
              </div>
              <div className="flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                12.5%
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div id="main-chart"></div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                  2,340
                </span>
                <h3 className="text-base font-normal text-gray-500">New products this week</h3>
              </div>
              <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                14.6%
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                  5,355
                </span>
                <h3 className="text-base font-normal text-gray-500">Visitors this week</h3>
              </div>
              <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                32.9%
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerPortal>
  );
};

export default MyPlan;
