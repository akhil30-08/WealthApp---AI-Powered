'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import HeroImage from '../../public/banner.jpeg';
import { useEffect, useRef } from 'react';
import { featuresData, howItWorksData, statsData, testimonialsData } from '@/data/homepage';
import { Card, CardContent } from './ui/card';

const HeroSection = () => {
   const imageRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const imageElement = imageRef.current;

      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         const scrollThreshold = 100;

         if (!imageElement) return;

         if (scrollPosition > scrollThreshold) {
            imageElement.classList.add('scrolled');
         } else {
            imageElement.classList.remove('scrolled');
         }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <section className='pb-20 px-3 mt-4'>
         <div className='container mx-auto text-center'>
            <h1 className='text-4xl md:text-7xl pb-4 gradient-text'>
               Manage Your Finances <br />
               With Intelligence
            </h1>

            <p className='text-base md:text-xl text-gray-500 max-w-2xl mx-auto mb-4'>
               An AI powered financial management system that helps you track, analyse and optimise your spending with real-time insights.
            </p>

            <Link href='/dashboard'>
               <Button
                  size='lg'
                  className='px-4 mb-5'
               >
                  Get Started
               </Button>
            </Link>
         </div>

         <div className='hero-image-wrapper'>
            <div
               ref={imageRef}
               className='hero-image'
            >
               <Image
                  src={HeroImage}
                  alt='Hero Image'
                  className='rounded-lg object-contain w-full shadow-lg'
               />
            </div>
         </div>

         <div className='bg-blue-100 py-10 grid grid-cols-2 md:grid-cols-4'>
            {statsData.map((stat) => (
               <div
                  key={stat.label}
                  className='text-center mt-5'
               >
                  <p className='text-4xl font-bold text-blue-600'>{stat.value}</p>
                  <p className='text-gray-600'>{stat.label}</p>
               </div>
            ))}
         </div>

         <div className='mt-3'>
            <h2 className='p-1 text-xs md:text-xl font-semibold text-center'>Everything you need to manage your finances.</h2>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-5'>
               {featuresData.map((feature) => (
                  <Card
                     key={feature.title}
                     className='p-2 md:p-6'
                  >
                     <CardContent>
                        {<feature.icon className='w-5 h-5 text-blue-600' />}
                        <p className='text-sm md:text-lg font-semibold my-1'>{feature.title}</p>

                        <p className='text-xs md:text-sm text-gray-600'>{feature.description}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         <div className='mt-3 bg-blue-100 pb-6'>
            <h2 className='py-6 text-xs md:text-xl font-semibold text-center'>How It Works.</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5'>
               {howItWorksData.map((data) => (
                  <div key={data.title}>
                     {<data.icon className='w-5 h-5 text-blue-600 mx-auto' />}

                     <h3 className='text-center text-sm md:text-xl font-semibold mb-2'>{data.title}</h3>
                     <p className='text-center text-xs md:text-base text-slate-600'>{data.description}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className='mt-3'>
            <h2 className='p-1 text-xs md:text-xl font-semibold text-center'>What our users say</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5'>
               {testimonialsData.map((testimony) => (
                  <Card
                     key={testimony.name}
                     className='p-3 md:p-6'
                  >
                     <CardContent>
                        <div className='flex gap-2 mb-4'>
                           <Image
                              src={testimony.image}
                              alt='image'
                              width={40}
                              height={40}
                              className='rounded-full'
                           />

                           <div>
                              <p className='font-medium'>{testimony.name}</p>
                              <p className='text-gray-600'>{testimony.role}</p>
                           </div>
                        </div>

                        <p className='text-gray-700'>{testimony.quote}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         <div className='bg-blue-600 py-14 mt-5 rounded-2xl flex flex-col items-center'>
            <p className='text-white text-center font-semibold text-lg md:text-3xl'>Ready to take control of your finances?</p>

            <p className='text-center text-slate-300 mt-3'>Join thousands of users who are already managing their finances with us.</p>

            <Link href='/dashboard'>
               <Button
                  size='lg'
                  className='px-7 mt-5 animate-bounce'
                  variant={'secondary'}
               >
                  Join Now
               </Button>
            </Link>
         </div>
      </section>
   );
};

export default HeroSection;
