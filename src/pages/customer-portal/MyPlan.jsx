import React, { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useHistory } from 'react-router-dom';
import Loading from '../../layouts/Loading';
import CustomerPortal from '../../templates/CustomerPortal';
import { BsCheck } from 'react-icons/bs';
import avatar from '../../assets/images/people/user.png';
import { getUsageData } from '../../api';
import { getMonthString } from '../../utils';

const currentYear = new Date().getFullYear();

const MyPlan = () => {
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const {
    signIn,
    state,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    httpRequest,
    getDecodedIDPIDToken
  } = useAuthContext();
  const reRenderCheckRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState();
  const [usage, setUsage] = useState();
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
    if (!state?.isAuthenticated) {
      return;
    }

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

      if (decodedIDToken?.mobileNumberVerified) {
        sessionStorage.setItem('verified', true);
      }

      console.log(derivedState);
      setDecodedIDTokenPayload(decodedIDToken);
    })();
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (!decodedIDTokenPayload) {
      return;
    }

    if (!sessionStorage.getItem('verified')) {
      history.push('/my-kfone/verify', decodedIDTokenPayload);
      return;
    }

    getUsageData(decodedIDTokenPayload?.userid || decodedIDTokenPayload?.sub, httpRequest).then(
      (data) => {
        console.log(data);
        setCurrentPlan(data.subscription);
        setUsage(data.usage);
        setLoading(false);
      }
    );
  }, [decodedIDTokenPayload]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <CustomerPortal>
          <section className="flex flex-col items-start justify-start">
            <div className="flex items-center justify-end w-full">
              <div className="flex flex-col items-center justify-center mx-4 rounded-full h-[60px] w-[60px] shadow">
                <img src={avatar} alt="user avatar" height={60} />
              </div>
              <div className="px-4 py-2 bg-light rounded-lg shadow">
                <h2 className="text-xl font-light text-primary">{decodedIDTokenPayload?.email}</h2>
                <h2 className="text-sm font-light text-primary-900">
                  {decodedIDTokenPayload?.phone_number}
                </h2>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:gap-4 my-4">
              <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">My Plan</h3>
                <div className="p-4">
                  <div className="flex items-baseline font-light w-full">
                    <h1 className="text-4xl text-primary">Kfone Starter</h1>
                    <h6 className="mx-2 py-1 px-2 bg-primary text-light rounded-lg text-[8px]">
                      {currentPlan.connectionType}
                    </h6>
                  </div>
                  <table className="items-center bg-transparent border-collapse w-full">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          <BsCheck className="inline text-emerald-400 mr-2" size={24} />
                          {currentPlan.freeDataMB} MB max speed data
                        </th>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          <BsCheck className="inline text-emerald-400 mr-2" size={24} />
                          {currentPlan.freeCallMinutes} minutes of standard national calls
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
                  Current Usage
                  <span className="text-sm font-light">
                    &nbsp; as of {new Date().toLocaleString('en-US')}
                  </span>
                </h3>
                <div className="block w-full overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Data
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          15MB remaining
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              {(15 / currentPlan.freeDataMB) * 100}%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-primary-100 h-2 rounded-sm"
                                  style={{
                                    width: `${(15 / currentPlan.freeDataMB) * 100}%`
                                  }}></div>
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
                          30 Mins remaining
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              {(30 / currentPlan.freeCallMinutes) * 100}%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-primary-100 h-2 rounded-sm"
                                  style={{
                                    width: `${(30 / currentPlan.freeCallMinutes) * 100}%`
                                  }}></div>
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
                          Unlimited
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">100%</span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-green-300 h-2 rounded-sm"
                                  style={{ width: '100%' }}></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                                Additional Purchases
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {usage.map((el, key) => (
                              <tr key={key}>
                                <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                  {getMonthString(el.month)}&nbsp;{el.year}
                                </td>
                                <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  {el.allocatedDataUsage}MB/{el.allocatedMinutesUsage}Mins
                                </td>
                                <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  {el.additionalPurchases.map((el2, subKey) => (
                                    <span
                                      key={subKey}
                                      className="bg-light rounded border border-secondary-50 inline-block p-1 mr-1">
                                      {el2.additionalData}MB/{el2.additionalMinutes}Mins
                                    </span>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-4 my-4">
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
              <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
                  Buy Data Addons & Subscriptions
                </h3>
                <table className="items-center w-full bg-transparent border-collapse">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="text-gray-500">
                      <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                        Additional data purchase
                      </th>
                    </tr>
                    <tr className="text-gray-500">
                      <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                        Buy data addons
                      </th>
                    </tr>
                    <tr className="text-gray-500">
                      <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                        Kfone Flex TV subscriptions
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </CustomerPortal>
      )}
    </>
  );
};

export default MyPlan;
