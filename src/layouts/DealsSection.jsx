import React from 'react';
import iphone_14_1 from '../assets/images/devices/iphone_14_1.jpg';
import pixel_6 from '../assets/images/devices/pixel_6.jpg';
import VerticalCard from '../components/cards/VerticalCard';
import HeaderTitle from '../components/headers/HeaderTitle';

const DealsSection = () => {
  return (
    <div className="md:px-10 grid grid-cols-1 md:grid-cols-2 gap-2 items-center bg-light p-4">
      <div className="text-secondary md:col-span-2 text-left mt-10">
        <div className="p-4">
          <HeaderTitle>Our Latest Deals</HeaderTitle>
          <p className="text-lg font-light text-secondary-600">
            Our best deals on cutting-edge devices are available to everyone
          </p>
        </div>
      </div>
      <VerticalCard
        title="iPhone 14 Pro"
        subTitle="Pro.Beyond"
        image={iphone_14_1}
        description="Learn how new and existing customers get up to $800 off with eligible trade-in."
        action={
          <a className="font-extralight text-xs underline text-secondary-50" href="/">
            See offer details
          </a>
        }
        styles="text-white bg-black rounded-2xl m-4 shadow-slate-600 shadow-lg transition ease-in-out delay-150 hover:scale-105 duration-300"
      />
      <VerticalCard
        title="Pixel 6"
        subTitle="Uniquely yours."
        image={pixel_6}
        description="Learn how new and existing customers get up to $300 off with eligible trade-in."
        action={
          <a className="font-extralight text-xs underline text-secondary-600" href="/">
            See offer details
          </a>
        }
        styles="text-black bg-white rounded-2xl m-4 shadow-brown-300 shadow-lg transition ease-in-out delay-150 hover:scale-105 duration-300"
      />
    </div>
  );
};

export default DealsSection;
