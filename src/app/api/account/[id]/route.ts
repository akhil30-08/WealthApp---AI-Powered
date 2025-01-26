import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

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

      // finding the account we want to update
      const account = await prisma.account.findUnique({
         where: {
            id,
         },
      });

      if (!account) {
         return NextResponse.json({ message: "This account doesn't exist" }, { status: 400 });
      }

      await prisma.account.updateMany({
         where: {
            userId: user?.id,
         },
         data: {
            isDefault: false,
         },
      });

      // now update the current account
      await prisma.account.update({
         where: {
            id,
         },
         data: {
            isDefault: true,
         },
      });
      return NextResponse.json({ message: 'Account updated' }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

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

      //now get account details
      const account = await prisma.account.findUnique({
         where: {
            userId: user?.id,
            id,
         },
         include: {
            transactions: {
               orderBy: { date: 'desc' },
            },
            _count: {
               select: {
                  transactions: true,
               },
            },
         },
      });

      if (!account) {
         return NextResponse.json({ message: "This account doesn't exist" }, { status: 400 });
      }

      return NextResponse.json({ message: 'Account found', account }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}
