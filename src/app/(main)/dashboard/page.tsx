import DashboardGrid from '@/components/DashboardGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

const Dashboard = () => {
   return (
      <section>
         <h1 className='gradient-text font-bold text-3xl md:text-6xl text-center'>Dashboard</h1>

         <Suspense fallback={<Skeleton className='h-2/4 w-auto rounded-xl' />}>
            <DashboardGrid />
         </Suspense>
      </section>
   );
};

export default Dashboard;
