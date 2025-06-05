'use client';

import AccountChart from '@/components/AccountChart';
import { APIData } from '@/components/DashboardGrid';
import TransactionTable from '@/components/TransactionTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiFetch } from '@/hooks/useApiFetch';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const AccountPage = () => {
   const { id } = useParams();

   const { data: accountData, fetchAPI, loading: loadingAccDetails } = useApiFetch<APIData>();

   useEffect(() => {
      const getAccount = async () => {
         await fetchAPI(`/api/account/${id}`, { method: 'GET' });
      };
      console.log('useeffect running');

      getAccount();
   }, [id]);

   console.log(accountData);

   return (
      <section className='space-y-8'>
         {loadingAccDetails ? (
            <div>
               <div className='flex justify-between '>
                  <Skeleton className='w-1/3 h-16' />
                  <div>
                     <Skeleton className='w-1/3 h-10' />
                     <p className='text-sm text-muted-foreground'> Transactions</p>
                  </div>
               </div>
               <div className='mt-9'>
                  <Skeleton className='w-full h-80' />
               </div>
            </div>
         ) : (
            <>
               {' '}
               <div className='flex gap-4 items-end justify-between'>
                  <div>
                     <h1 className='text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize'>{accountData?.account?.name}</h1>
                     <p className='text-muted-foreground'>{accountData?.account?.type}</p>
                  </div>

                  <div className='text-right pb-2'>
                     <div className='text-xl sm:text-2xl font-bold'>${Number(accountData?.account?.balance).toFixed(3)}</div>
                     <p className='text-sm text-muted-foreground'>{accountData?.account?._count?.transactions} Transactions</p>
                  </div>
               </div>
               {/* chart section} */}
               <AccountChart transactions={accountData?.account?.transactions ?? []} />
               <TransactionTable transactions={accountData?.account?.transactions ?? []} />
            </>
         )}
      </section>
   );
};

export default AccountPage;
