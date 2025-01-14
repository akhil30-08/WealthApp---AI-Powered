import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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
      });

      if (userAccounts.length === 0) {
         return NextResponse.json({ message: 'No accounts found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Accounts Found', payload: userAccounts }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}
