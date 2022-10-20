import React from 'react';
import CustomerPortal from '../../templates/CustomerPortal';
import avatar from '../../assets/images/people/user.png';

const MyPlanWithoutAuth = () => {
  const renderPlanContent = () => (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:gap-4 my-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">My Plan</h3>
          No Plan Data Available
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
            Current Usage
            <span className="text-sm font-light">
              &nbsp; as of {new Date().toLocaleString('en-US')}
            </span>
          </h3>
          No Usage Data Available
        </div>
      </div>

      <div className="w-full grid grid-cols-1 xl:gap-4 my-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Usage History</h3>
            </div>
          </div>
          No Usage Available
        </div>
      </div>
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-4 my-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Payments</h3>
            </div>
          </div>
          No Payment Data Available
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
          <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
            Buy Data Addons & Subscriptions
          </h3>
          No Addon & Subscription Recommendations Available
        </div>
      </div>
    </>
  );

  return (
    <CustomerPortal>
      <section className="flex flex-col items-start justify-start">
        <div className="flex items-center justify-end w-full">
          <div className="flex flex-col items-center justify-center mx-4 rounded-full h-[60px] w-[60px] shadow">
            <img src={avatar} alt="user avatar" height={60} />
          </div>
          <div className="px-4 py-2 bg-light rounded-lg shadow">
            <h2 className="text-xl font-light text-primary">unknown</h2>
            <h2 className="text-sm font-light text-primary-900">unknown</h2>
          </div>
        </div>
        {renderPlanContent()}
      </section>
    </CustomerPortal>
  );
};

export default MyPlanWithoutAuth;
