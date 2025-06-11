'use client';
import React, { useCallback, useEffect } from 'react';
import DrawerComponent from './DrawerComponent';
import { Card, CardContent } from './ui/card';
import { Plus } from 'lucide-react';
import { AccountCard } from './AccountCard';
import { useApiFetch } from '@/hooks/useApiFetch';
import { Account, Transaction } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';
import BudgetSection from './BudgetSection';

export type APIData = {
   message: string;
   payload?: Account[] | null;
   account?:
      | (Account & {
           _count?: {
              transactions: number;
           };
           transactions?: Transaction[];
        })
      | null;
};

const DashboardGrid = () => {
   const { data: accountsData, fetchAPI, loading: loadingAccounts } = useApiFetch<APIData>();

   const fetchAccounts = useCallback(async () => {
      try {
         await fetchAPI('/api/account', { method: 'GET' });
      } catch (error) {
         console.log('Error happened in callback' + error);
      }
   }, []);

   useEffect(() => {
      fetchAccounts();
   }, [fetchAccounts]);

   const defaultAccount = accountsData?.payload?.find((account) => account.isDefault === true);

   return (
      <>
         <section>{defaultAccount && <BudgetSection defaultAccount={defaultAccount as Account} />}</section>
         <section className='my-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-sm:px-2 '>
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
                  fetchAccounts={fetchAccounts}
               />
            ))}
         </section>
      </>
   );
};

export default DashboardGrid;
