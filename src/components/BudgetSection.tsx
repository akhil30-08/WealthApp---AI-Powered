import { Account } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApiFetch } from '@/hooks/useApiFetch';
import { IBudgetData } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';

const BudgetSection = ({ defaultAccount }: { defaultAccount: Account }) => {
   //TODO add loading isBudgetLoading
   const { fetchAPI } = useApiFetch<IBudgetData>();

   const [setBudget, setSetBudget] = useState<boolean>(false);
   const [budgetAmount, setBudgetAmount] = useState<number>(1);

   const [budgetExpData, setBudgetExpData] = useState<IBudgetData | null>(null);

   const [isBudgetUpdateLoading, setIsBudgetUpdateLoading] = useState(false);

   //fetch budget and expense data
   const getBudget = async () => {
      try {
         const response = await fetchAPI(`/api/budget?accountId=${defaultAccount?.id}`, {
            method: 'GET',
         });

         setBudgetExpData(response);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getBudget();
   }, [defaultAccount]);

   const handleBudget = async () => {
      setIsBudgetUpdateLoading(true);
      if (budgetAmount === 0) {
         return toast.error('Budget cannot be 0');
      }

      const response: IBudgetData = await fetchAPI('/api/budget', {
         method: 'POST',
         data: {
            amount: budgetAmount,
         },
      });

      if (response?.budgetDetails) {
         getBudget();
         setSetBudget(false);
         setIsBudgetUpdateLoading(false);
         toast.success('Budget Added');
      } else {
         setSetBudget(false);
         setIsBudgetUpdateLoading(false);
         toast.error('Unexpected Error Happened');
      }
   };

   console.log(budgetExpData);

   const percentageSpent = budgetExpData?.expenseDetails?._sum?.amount
      ? (Number(budgetExpData?.expenseDetails?._sum?.amount) / Number(budgetExpData?.budgetDetails?.amount)) * 100
      : 0;

   const progressColor = (percentageSpent: number) => {
      if (percentageSpent >= 75 && percentageSpent < 90) {
         return 'bg-yellow-50';
      } else if (percentageSpent >= 90) {
         return 'bg-red-500';
      } else {
         return 'bg-green-500';
      }
   };

   return (
      <section>
         <Card className='p-3'>
            <CardHeader>
               <CardTitle>Monthly Budget (Default Account)</CardTitle>
               {!budgetExpData?.budgetDetails && <CardDescription className='text-center'>Please set your Monthly Budget</CardDescription>}
            </CardHeader>

            <CardContent className='mt-3'>
               <div className='flex flex-col md:flex-row items-center gap-3 '>
                  <Button
                     onClick={() => setSetBudget(true)}
                     className='mt-2'
                     size={'sm'}
                  >
                     {budgetExpData?.budgetDetails ? 'Edit' : 'Create'} Budget
                  </Button>

                  {budgetExpData?.budgetDetails && (
                     <div className='w-full flex flex-col items-center gap-2'>
                        {isBudgetUpdateLoading ? (
                           <>
                              <Skeleton className='h-10 w-full rounded-lg shadow-sm' />
                           </>
                        ) : (
                           <>
                              {' '}
                              <Progress
                                 value={percentageSpent}
                                 indicatorColor={`${progressColor(percentageSpent)}`}
                                 className='md:mt-5'
                              />
                              <p>
                                 ${String(budgetExpData?.expenseDetails?._sum?.amount)} of ${String(budgetExpData?.budgetDetails?.amount)} spent
                              </p>
                           </>
                        )}
                     </div>
                  )}
               </div>

               {setBudget && (
                  <>
                     <Input
                        type='number'
                        placeholder='Enter Amount'
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(Number(e.target.value))}
                        className='max-w-52 my-5'
                        min={1}
                     />

                     <div className='flex gap-5'>
                        <Button
                           variant={'ghost'}
                           onClick={handleBudget}
                           disabled={isBudgetUpdateLoading}
                        >
                           <Check
                              color='green'
                              className=' cursor-pointer h-10 w-10'
                           />
                        </Button>
                        <Button
                           variant={'ghost'}
                           onClick={() => setSetBudget(false)}
                           disabled={isBudgetUpdateLoading}
                        >
                           <X
                              color='red'
                              size={35}
                              className=' cursor-pointer'
                           />
                        </Button>
                     </div>
                  </>
               )}
            </CardContent>
         </Card>
      </section>
   );
};

export default BudgetSection;
