import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

const NotFound = () => {
   return (
      <section className=' bg-green-100/20 min-h-screen flex items-center'>
         <Card className='md:w-3/4 mx-auto border border-black'>
            <CardHeader>
               <CardTitle className='flex gap-3'>
                  <span>
                     <MoveLeft />
                  </span>
                  Page Not Found
               </CardTitle>
               <CardDescription>Oh Oh! You have entered wrong URL.</CardDescription>
            </CardHeader>
            <CardContent>
               <Link href={'/'}>
                  <Button className='bg-black text-white rounded-md hover:text-gray-700'>Go To Home Page</Button>
               </Link>
            </CardContent>
         </Card>
      </section>
   );
};

export default NotFound;
