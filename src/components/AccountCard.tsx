'use client';

import { ArrowUpRight, ArrowDownRight, TrashIcon, Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Account } from '@prisma/client';
import { Button } from './ui/button';
import { useApiFetch } from '@/hooks/useApiFetch';
import { toast } from 'sonner';
import { APIData } from './DashboardGrid';

export function AccountCard({ account, fetchAccounts }: { account: Account; fetchAccounts: () => void }) {
   const { name, type, balance, isDefault, id } = account;

   const { loading, error, fetchAPI } = useApiFetch<APIData>();

   const handleDeleteAccount = async (e: React.FormEvent<HTMLElement>, accountId: string) => {
      e.preventDefault();
      const result = await fetchAPI('/api/account', { method: 'DELETE', data: { id: accountId } });

      if (error) return;
      if (result?.message) {
         fetchAccounts();
         toast.success(result?.message);
      }
   };

   return (
      <Card className='hover:shadow-md transition-shadow group relative p-2 '>
         <Link href={`/account/${id}`}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
               <CardTitle className='text-sm font-medium capitalize '>{name}</CardTitle>
               <Switch checked={isDefault} />
            </CardHeader>
            <CardContent>
               <div className='text-xl font-bold'>$ {balance.toString()}</div>
               <p className='text-muted-foreground text-xs'>{type.charAt(0) + type.slice(1).toLocaleLowerCase()} Account</p>
            </CardContent>
            <CardFooter className='flex justify-between text-sm text-muted-foreground mt-3'>
               <div className='flex items-center'>
                  <ArrowUpRight className='mr-1 h-4 w-4 text-green-500' />
                  Income
               </div>
               <div className='flex items-center'>
                  <ArrowDownRight className='mr-1 h-4 w-4 text-red-500' />
                  Expense
               </div>
            </CardFooter>
         </Link>
         <Button
            variant={'destructive'}
            className='relative top-5 mx-auto flex rounded-lg '
            size={'sm'}
            type='button'
            onClick={(e) => handleDeleteAccount(e, id)}
            disabled={loading}
         >
            {loading ? <Loader className='w-3 h-3 animate-spin' /> : <TrashIcon />}
         </Button>
      </Card>
   );
}
