import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
   try {
      const { name, balance, type, isDefault } = await request.json();

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

      const actualBalance = parseFloat(balance);

      //check if this is user's first account and if it is , then make the account default
      const accounts = await prisma.account.findMany({
         where: {
            userId: user.id,
         },
      });

      const isUserFirstAccount = accounts.length === 0;

      //if its users first account or user is making new default account, then remove default from all other accounts

      if (isDefault) {
         await prisma.account.updateMany({
            where: {
               userId: user.id,
            },
            data: {
               isDefault: false,
            },
         });
      }

      const newAccount = await prisma.account.create({
         data: {
            name,
            balance: actualBalance,
            type,
            isDefault: isUserFirstAccount ? true : isDefault,
            user: {
               connect: {
                  id: user.id,
               },
            },
         },
      });

      return NextResponse.json({ message: 'Account created successfully', payload: newAccount }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}

export async function GET() {
   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const loggedInUser = await prisma.user.findUnique({
         where: {
            clerkUserId: userId,
         },
      });

      if (!loggedInUser) {
         return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const userAccounts = await prisma.account.findMany({
         where: {
            userId: loggedInUser.id,
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      if (!userAccounts) {
         return NextResponse.json({ message: 'No accounts found' }, { status: 404 });
      }

      if (userAccounts.length === 0) {
         return NextResponse.json({ message: 'No accounts found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Accounts Found', payload: userAccounts }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}
