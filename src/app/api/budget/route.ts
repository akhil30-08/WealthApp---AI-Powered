import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { endOfMonth, startOfMonth } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const { searchParams } = request.nextUrl;
   const accountId = searchParams.get('accountId');

   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
         where: {
            clerkUserId: userId,
         },
      });

      if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      // find budget
      const userBudget = await prisma.budget.findFirst({
         where: {
            userId: user.id,
         },
      });

      const currentDate = new Date();
      const startofMonth = startOfMonth(currentDate);
      const endofMonth = endOfMonth(currentDate);

      const expenses = await prisma.transaction.aggregate({
         where: {
            userId: user.id,
            type: 'EXPENSE',
            date: {
               gte: startofMonth,
               lte: endofMonth,
            },
            accountId: accountId ? accountId : undefined,
         },
         _sum: {
            amount: true,
         },
      });

      return NextResponse.json(
         {
            message: 'Budget and Expenses Found',
            budgetDetails: userBudget ? userBudget : null,
            expenseDetails: expenses ? expenses : 0,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}

export async function POST(request: NextRequest) {
   const { amount } = await request.json();
   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
         where: {
            clerkUserId: userId,
         },
      });

      if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const budgetCreate = await prisma.budget.upsert({
         create: {
            amount,
            userId: user.id,
         },
         update: {
            amount,
         },
         where: {
            userId: user.id,
         },
      });

      return NextResponse.json(
         {
            message: 'Budget succesfully created/updated',
            budgetDetails: budgetCreate,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}
