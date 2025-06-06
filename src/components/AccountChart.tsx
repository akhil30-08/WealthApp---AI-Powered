import { Transaction } from '@prisma/client';
import { ChartContainer, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useMemo, useState } from 'react';

//chart config
const chartConfig = {
   income: {
      label: 'Income',
      color: '#1bd556',
   },
   expense: {
      label: 'Expense',
      color: '#d82932',
   },
} satisfies ChartConfig;

const DATE_RANGES = {
   '7D': { label: 'Last 7 Days', days: 7 },
   '1M': { label: 'Last Month', days: 30 },
   '3M': { label: 'Last 3 Months', days: 90 },
   '6M': { label: 'Last 6 Months', days: 180 },
   ALL: { label: 'All Time', days: null },
};

type DateRangeKey = keyof typeof DATE_RANGES;

const AccountChart = ({ transactions }: { transactions: Transaction[] }) => {
   const [dateRange, setDateRange] = useState<DateRangeKey>('3M');

   const chartData = useMemo(() => {
      const range = DATE_RANGES[dateRange];
      const now = new Date();

      const startingDay = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));
      const endingDay = endOfDay(now);

      const filteredTransactions = transactions.filter(
         (transaction) => new Date(transaction.date) >= startingDay && new Date(transaction.date) <= endingDay
      );

      const groupedData: { [date: string]: { date: string; income: number; expense: number } } = {};

      for (const transaction of filteredTransactions) {
         const date = format(new Date(transaction.date), 'MMM dd');

         if (!groupedData[date]) {
            groupedData[date] = { date, income: 0, expense: 0 };
         }
         if (transaction.type === 'INCOME') {
            groupedData[date].income += Number(transaction.amount);
         } else {
            groupedData[date].expense += Number(transaction.amount);
         }
      }

      // Convert to array and sort by date
      return Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
   }, [transactions, dateRange]);

   const totals = useMemo(() => {
      return chartData.reduce(
         (acc, day) => ({
            income: acc.income + day.income,
            expense: acc.expense + day.expense,
         }),
         { income: 0, expense: 0 }
      );
   }, [chartData]);

   const netAmount = totals.income - totals.expense;

   console.log(chartData);

   return (
      <Card className='py-7 px-3'>
         <CardHeader className='mb-5'>
            <div className='flex justify-between items-center'>
               <CardTitle>Transaction Overview</CardTitle>
               <Select
                  value={dateRange}
                  onValueChange={(value) => setDateRange(value as DateRangeKey)}
               >
                  <SelectTrigger className='w-[150px]'>
                     <SelectValue placeholder='Select Range' />
                  </SelectTrigger>
                  <SelectContent>
                     {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                        <SelectItem
                           value={key}
                           key={key}
                        >
                           {label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className='flex justify-evenly my-5'>
               <div className='flex flex-col'>
                  Total Income
                  <p className='text-green-500'>${totals.income.toFixed(2)}</p>
               </div>
               <div>
                  Total Expenses
                  <p className='text-red-600'>${totals.expense.toFixed(2)}</p>
               </div>
               <div>
                  Net
                  <p className={`${totals.income >= totals.expense ? 'text-green-600' : 'text-red-600'}`}>${netAmount.toFixed(2)}</p>
               </div>
            </div>
         </CardHeader>

         <CardContent>
            <ChartContainer
               config={chartConfig}
               className='min-h-[200px] w-full'
            >
               <BarChart
                  accessibilityLayer
                  data={chartData}
               >
                  <CartesianGrid vertical={false} />
                  <XAxis
                     dataKey='date'
                     tickLine={false}
                     tickMargin={10}
                     axisLine={false}
                     tickFormatter={(value) => value}
                  />
                  <YAxis
                     dataKey=''
                     tickLine={false}
                     tickMargin={5}
                     axisLine={false}
                     tickFormatter={(value) => `$${value}`}
                     tickCount={7}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                     dataKey='income'
                     fill='var(--color-income)'
                     radius={4}
                  />
                  <Bar
                     dataKey='expense'
                     fill='var(--color-expense)'
                     radius={4}
                  />
               </BarChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
};

export default AccountChart;
