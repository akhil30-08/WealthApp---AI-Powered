'use client';
import React, { useEffect } from 'react';
import DrawerComponent from './DrawerComponent';
import { Card, CardContent } from './ui/card';
import { Plus } from 'lucide-react';
import { AccountCard } from './AccountCard';
import { useApiFetch } from '@/hooks/useApiFetch';
import { Account } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

export type APIData = {
   message: string;
   payload?: Account[] | null;
};

const DashboardGrid = () => {
   const { data: accountsData, fetchAPI, loading: loadingAccounts } = useApiFetch<APIData>();

   const fetchAccounts = async () => {
      await fetchAPI('/api/account', { method: 'GET' });
   };

   useEffect(() => {
      console.log(Math.random());

      fetchAccounts();
   }, []);

   return (
      <section className='my-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
         <DrawerComponent fetchAccounts={fetchAccounts}>
            <Card className='hover:shadow-md border-dashed min-w-full p-2 relative'>
               <CardContent className='space-y-4'>
                  <Plus className='h-6 w-6 mx-auto' />
                  <p className='text-base font-medium text-center'>Add New Account</p>
               </CardContent>
            </Card>
         </DrawerComponent>

         {loadingAccounts && (
            <>
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                     className='h-40 w-auto rounded-md bg-gray-300'
                     key={index}
                  />
               ))}
            </>
         )}

         {accountsData?.payload?.length === 0 && (
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
