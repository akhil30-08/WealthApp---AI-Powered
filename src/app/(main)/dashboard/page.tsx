import DashboardGrid from '@/components/DashboardGrid';

const Dashboard = () => {
   return (
      <section>
         <h1 className='gradient-text font-bold text-4xl md:text-6xl text-center pb-3'>Dashboard</h1>
         <DashboardGrid />
      </section>
   );
};

export default Dashboard;
