import { prisma } from '@/lib/prisma';
import { inngest } from './client';
import { endOfMonth, startOfMonth } from 'date-fns';

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
         console.log({ totalExpense });

         const budgetAmount = parseFloat(budget?.amount);
         const percentage = (totalExpense / budgetAmount) * 100;

         if (percentage >= 80 && (!budget?.lastAlertSent || isNewMonth(new Date(budget?.lastAlertSent)))) {
            // Construct the correct API URL
            const baseUrl = 'http://localhost:3000';

            const apiUrl = `${baseUrl}/api/sendBudgetAlert`;

            await step.run(`send-alert-${budget.id}`, async () => {
               try {
                  console.log(`Sending alert to: ${apiUrl}`);

                  const response = await step.fetch(apiUrl, {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                        percentageUsed: percentage,
                        budgetAmount,
                        totalExpenses: totalExpense,
                     }),
                  });

                  if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const resultData = await response.json();
                  console.log('API Response:', resultData);

                  // Update lastAlertSent after successful API call
                  await prisma.budget.update({
                     where: { id: budget.id },
                     data: { lastAlertSent: new Date() },
                  });

                  console.log(`Budget alert sent successfully for budget ${budget.id}`);
               } catch (error) {
                  console.error(`Failed to send budget alert for budget ${budget.id}:`, error);
                  // Don't update lastAlertSent if the API call failed
                  throw error; // Re-throw to let Inngest handle retry logic
               }
            });
         }
      });
   }
});

// Fixed function name and logic
const isNewMonth = (lastAlertDate: Date): boolean => {
   const currentDate = new Date();
   return lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear();
};
