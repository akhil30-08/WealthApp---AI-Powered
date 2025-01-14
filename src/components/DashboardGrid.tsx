'use client';
import React, { useEffect } from 'react';
import DrawerComponent from './DrawerComponent';
import { Card, CardContent } from './ui/card';
import { Loader, Plus } from 'lucide-react';
import { AccountCard } from './AccountCard';
import { useApiFetch } from '@/hooks/useApiFetch';
import { Account } from '@prisma/client';

type AccountsData = {
   message: string;
   payload: Account[];
};

const DashboardGrid = () => {
   const { data: accountsData, fetchAPI, loading } = useApiFetch<AccountsData>();

   useEffect(() => {
      fetchAPI('/api/account', { method: 'GET' });
   }, []);

   if (loading) {
      return (
         <p className='text-center text-2xl font-semibold mt-5'>
            Your accounts will be reflected shortly...
            <span>
               <Loader className='animate-spin h-6 w-6 inline' />
            </span>
         </p>
      );
   }

   return (
      <section className='my-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
         <DrawerComponent>
            <Card className='hover:shadow-md border-dashed min-w-full p-2 relative'>
               <CardContent className='space-y-4'>
                  <Plus className='h-6 w-6 mx-auto' />
                  <p className='text-base font-medium text-center'>Add New Account</p>
               </CardContent>
            </Card>
         </DrawerComponent>

         {!accountsData?.payload && (
            <p className='text-2xl font-medium text-slate-600 relative top-28 text-center max-lg:max-w-xs'>You got no accounts. Please add one.</p>
         )}

         {accountsData?.payload?.map((account: Account) => (
            <AccountCard
               key={account.id}
               account={account}
            />
         ))}
      </section>
   );
};

export default DashboardGrid;
