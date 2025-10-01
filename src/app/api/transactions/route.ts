import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { calculateNextRecurringDate } from '@/lib/utils';
import { request as arcjetRequest } from '@arcjet/next';
import { aj } from '@/lib/arcjet';

//TODO check it later on after adding transactions manually

export async function DELETE(request: NextRequest) {
   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { transactionId } = await request.json();
      console.log(transactionId);

      const user = await prisma.user.findUnique({
         where: {
            clerkUserId: userId,
         },
      });

      if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const transactions = await prisma.transaction.findMany({
         where: {
            userId: user.id,
            id: {
               in: transactionId,
            },
         },
      });

      let balanceChanges = 0;

      if (transactions.length > 0) {
         for (const transaction of transactions) {
            if (transaction.type === 'EXPENSE') {
               balanceChanges += Number(transaction?.amount);
            } else {
               balanceChanges -= Number(transaction?.amount);
            }
         }
      }

      await prisma.$transaction(async (tx) => {
         //delete transactions

         await tx.transaction.deleteMany({
            where: {
               userId: user.id,
               id: {
                  in: transactionId,
               },
            },
         });

         //update balance in account
         await tx.account.update({
            where: {
               userId: user.id,
               id: transactions[0]?.accountId,
            },
            data: {
               balance: {
                  increment: balanceChanges,
               },
            },
         });
      });

      return NextResponse.json({ message: 'Transaction(s) deleted' }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const { amount, type, description, isRecurring, date, accountId, category, recurringInterval } = await request.json();

      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      //ArcJet
      const arcRequest = await arcjetRequest();
      const decision = await aj.protect(arcRequest, {
         userId,
         requested: 2,
      });

      if (decision.isDenied()) {
         if (decision.reason.isRateLimit()) {
            return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
         }
         return NextResponse.json({ message: 'Request blocked' }, { status: 403 });
      }

      const user = await prisma.user.findUnique({
         where: {
            clerkUserId: userId,
         },
      });

      if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const account = await prisma.account.findUnique({
         where: {
            id: accountId,
            userId: user.id,
         },
      });

      if (!account) {
         return NextResponse.json({ message: 'Account not found' }, { status: 400 });
      }

      let balanceofAccount: number = Number(account?.balance) || 0;
      if (type === 'EXPENSE') {
         balanceofAccount -= Number(amount);
      } else {
         balanceofAccount += Number(amount);
      }

      const result = await prisma.$transaction(async (tx) => {
         const newTransaction = await tx.transaction.create({
            data: {
               amount: Number(amount),
               category,
               type,
               description,
               isRecurring,
               date,
               userId: user.id,
               accountId,
               recurringInterval: isRecurring ? recurringInterval : null,
               nextRecurringDate: isRecurring && recurringInterval ? calculateNextRecurringDate(date, recurringInterval) : null,
            },
         });

         await tx.account.update({
            where: {
               id: accountId,
            },
            data: {
               balance: balanceofAccount,
            },
         });

         return newTransaction;
      });

      return NextResponse.json({ message: 'Transaction Created Succesfully', payload: result }, { status: 200 });
   } catch (error) {
      console.log(error);
      NextResponse.json({ message: error }, { status: 400 });
   }
}
