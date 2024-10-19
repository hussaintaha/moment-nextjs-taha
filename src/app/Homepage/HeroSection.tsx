import React from 'react';

import Image from 'next/image';

import Link from 'next/link';

import CustomButtonGray from '@/components/buttonGray';



function HeroSection() {
  return (
    <div className="h-auto bg-bgYellow">
      <div className="flex flex-col bg-red py-2 items-center text-white justify-center">
        <h1 className="font-bold">THIS IS A PREVIEW SHOP</h1>
        <h4 className="font-semibold">
          (Warning: Do not use as campaign link)
        </h4>
      </div>
      <div className="bg-yellow py-2 flex items-center justify-center font-semibold text-md">
        🌟 FREE SHIPPING ON ALL ORDERS 🌟
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:py-12 sm:py-6 py-4">
        <div className='space-y-6 py-8 sm:py-12 md:py-16'>
          <p className="md:text-5xl text-4xl font-bold mb-4 leading-tight">
            3 Reasons Why <br /> MOMENT is Better
            <br /> Than Booze
          </p>
          <CustomButtonGray text="Go to Google" href="https://www.google.com"/>
          <Link href="#reviewSection" ><div className='text-lg pt-3'>★ ★ ★ ★ ★ 1,884 reviews</div></Link>
        
        </div> 
        <div className='flex md:justify-end justify-center'>
          <Image
            src="/images/heroImage.svg"
            alt="heroImage"
            width={64}
            height={64}
            className="w-auto h-full "
          />
        </div>
      </div>
      <div className="bg-yellow py-2 flex items-center justify-center font-semibold text-md">
        🌟 FREE SHIPPING ON ALL ORDERS 🌟
      </div>
    </div>
  );
}

export default HeroSection;
