import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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
