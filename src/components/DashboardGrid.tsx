import React from 'react';
import DrawerComponent from './DrawerComponent';
import { Card, CardContent } from './ui/card';
import { Plus } from 'lucide-react';

const DashboardGrid = () => {
   return (
      <section className='my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
         <DrawerComponent>
            <Card className='hover:shadow-md border-dashed min-w-full p-2'>
               <CardContent className='space-y-4'>
                  <Plus className='h-6 w-6 mx-auto' />
                  <p className='text-base font-medium text-center'>Add New Account</p>
               </CardContent>
            </Card>
         </DrawerComponent>

         <div>x</div>
         <div>y</div>
      </section>
   );
};

export default DashboardGrid;
