import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET() {
   const ACCOUNT_ID = 'b607fdb8-f788-4de4-bd9c-d5fb97ebc951';
   const USER_ID = 'd8a85e81-46d1-473d-9865-c309c18d170e';

   // Categories with their typical amount ranges
   const CATEGORIES = {
      INCOME: [
         { name: 'salary', range: [5000, 8000] },
         { name: 'freelance', range: [1000, 3000] },
         { name: 'investments', range: [500, 2000] },
         { name: 'other-income', range: [100, 1000] },
      ],
      EXPENSE: [
         { name: 'housing', range: [1000, 2000] },
         { name: 'transportation', range: [100, 500] },
         { name: 'groceries', range: [200, 600] },
         { name: 'utilities', range: [100, 300] },
         { name: 'entertainment', range: [50, 200] },
         { name: 'food', range: [50, 150] },
         { name: 'shopping', range: [100, 500] },
         { name: 'healthcare', range: [100, 1000] },
         { name: 'education', range: [200, 1000] },
         { name: 'travel', range: [500, 2000] },
      ],
   };

   function getRandomAmount(min, max) {
      return Number((Math.random() * (max - min) + min).toFixed(2));
   }

   function getRandomCategory(type) {
      const categories = CATEGORIES[type];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = getRandomAmount(category.range[0], category.range[1]);
      return { category: category.name, amount };
   }

   async function seedTransactions() {
      try {
         const transactions = [];
         let totalBalance = 0;

         for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);

            const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
               const type = Math.random() < 0.4 ? 'INCOME' : 'EXPENSE';
               const { category, amount } = getRandomCategory(type);

               const transaction = {
                  id: crypto.randomUUID(),
                  type,
                  amount,
                  description: `${type === 'INCOME' ? 'Received' : 'Paid for'} ${category}`,
                  date,
                  category,
                  status: 'COMPLETED',
                  userId: USER_ID,
                  accountId: ACCOUNT_ID,
                  createdAt: date,
                  updatedAt: date,
               };

               totalBalance += type === 'INCOME' ? amount : -amount;
               transactions.push(transaction);
            }
         }

         // 1. Clear existing transactions
         await prisma.transaction.deleteMany({
            where: { accountId: ACCOUNT_ID },
         });

         // 2. Insert in chunks (avoid DB limits)
         const CHUNK_SIZE = 100;
         for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
            await prisma.transaction.createMany({
               data: transactions.slice(i, i + CHUNK_SIZE),
            });
         }

         // 3. Update account balance
         await prisma.account.update({
            where: { id: ACCOUNT_ID },
            data: { balance: totalBalance },
         });

         return {
            success: true,
            message: `Created ${transactions.length} transactions`,
            balance: totalBalance,
         };
      } catch (error) {
         console.error('Error seeding transactions:', error);
         return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
   }

   const result = await seedTransactions();
   return NextResponse.json(result);
}
