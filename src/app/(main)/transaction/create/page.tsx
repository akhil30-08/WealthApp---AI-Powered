'use client';

import CreateTxnForm from '@/components/CreateTxnForm';
import { APIData } from '@/components/DashboardGrid';
import { useApiFetch } from '@/hooks/useApiFetch';
import { defaultCategories } from '@/lib/utils';
import React, { useCallback, useEffect } from 'react';

const AddTransaction = () => {
   //?TODO add loading
   const { data: accountsData, fetchAPI } = useApiFetch<APIData>();

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

   return (
      <div className='max-w-3xl mx-auto p-5'>
         <h1 className='text-5xl gradient-text mb-8'>Add Transaction</h1>
         <CreateTxnForm
            accountsData={accountsData ?? { message: '', payload: null }}
            categories={defaultCategories}
         />
      </div>
   );
};

export default AddTransaction;
