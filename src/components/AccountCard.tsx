'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Account } from '@prisma/client';

export function AccountCard({ account }: { account: Account }) {
   const { name, type, balance } = account;
   return (
      <Card className='hover:shadow-md transition-shadow group relative p-2'>
         <Link href={`/account/6`}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
               <CardTitle className='text-sm font-medium capitalize '>{name}</CardTitle>
               <Switch />
            </CardHeader>
            <CardContent>
               <div className='text-xl font-bold'>$ {balance.toString()}</div>
               <p className='text-muted-foreground'>{type.charAt(0) + type.slice(1).toLocaleLowerCase()} Account</p>
            </CardContent>
            <CardFooter className='flex justify-between text-sm text-muted-foreground'>
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
      </Card>
   );
}
