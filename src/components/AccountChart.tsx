import { Transaction } from '@prisma/client';

const AccountChart = ({ transactions }: { transactions: Transaction[] }) => {
   console.log(transactions);

   return <div>AccountChart</div>;
};

export default AccountChart;
