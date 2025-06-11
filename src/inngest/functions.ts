import { prisma } from '@/lib/prisma';
import { inngest } from './client';
import { endOfMonth, startOfMonth } from 'date-fns';
import axios from 'axios';

export const checkBudgetAlert = inngest.createFunction({ id: 'Create Budget Alerts' }, { cron: '0 */6 * * *' }, async ({ step }) => {
   await step.sleep('wait-a-moment', '1s');

   const budgets = await step.run('fetching budget', async () => {
      return await prisma.budget.findMany({
         include: {
            user: {
               include: {
                  accounts: {
                     where: {
                        isDefault: true,
                     },
                  },
               },
            },
         },
      });
   });

   console.log(budgets);

   for (const budget of budgets) {
      const defaultAccount = budget?.user?.accounts?.[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget?.id}`, async () => {
         const currentDate = new Date();
         const startofMonth = startOfMonth(currentDate);
         const endofMonth = endOfMonth(currentDate);

         const expenses = await prisma.transaction.aggregate({
            where: {
               userId: budget?.userId,
               type: 'EXPENSE',
               date: {
                  gte: startofMonth,
                  lte: endofMonth,
               },
               accountId: defaultAccount?.id,
            },
            _sum: {
               amount: true,
            },
         });
         const totalExpense = parseFloat((expenses?._sum?.amount ?? 0).toString());

         const budgetAmount = parseFloat(budget?.amount);

         const percentage = (totalExpense / budgetAmount) * 100;

         if (percentage >= 80 && (!budget?.lastAlertSent || isnewMonth(new Date(budget?.lastAlertSent)))) {
            // send Email

            const BASE_URI = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/sendBudgetAlert';

            const result = await axios(`${BASE_URI}`, {
               method: 'POST',

               data: {
                  userName: budget?.user?.name || '',
                  type: 'budget-alert',
                  data: {
                     percentageUsed: percentage,
                     budgetAmount,
                     totalExpenses: totalExpense,
                  },
               },
            });

            console.log(result);

            //update Last Alert Sent
            await prisma.budget.update({
               where: {
                  id: budget?.id,
               },
               data: {
                  lastAlertSent: new Date(),
               },
            });
         }
      });
   }
});

const isnewMonth = (lastAlertDate: Date) => {
   return lastAlertDate.getMonth !== new Date().getMonth || lastAlertDate.getFullYear !== new Date().getFullYear;
};
