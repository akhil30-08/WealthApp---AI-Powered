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

      //check if user is trying to make the account default and find previous default account and make it non default
      const isDefault = account.isDefault;

      if (isDefault) {
         //check if user is trying to make its first account non default or not

         const userAccounts = await prisma.account.findMany({
            where: {
               userId: user.id,
            },
         });

         const isFirstAccount = userAccounts.length === 1;

         //check if user has exactly 1 default account

         const onlyOneDefAcc = await prisma.account.findMany({
            where: {
               userId: user.id,
               isDefault: true,
            },
         });

         if (isFirstAccount || onlyOneDefAcc.length === 1) {
            return NextResponse.json({ message: 'Need atleast 1 Default Account' }, { status: 400 });
         }
         await prisma.account.update({
            where: {
               id,
            },
            data: {
               isDefault: !isDefault,
            },
         });

         return NextResponse.json({ message: 'Account updated' }, { status: 200 });
      }

      //if isDefault is false, that means user is trying to make it default and if thats the case, first make all other accounts nondefault

      await prisma.account.updateMany({
         where: {
            userId: user?.id,
         },
         data: {
            isDefault: false,
         },
      });

      //now make current account default
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
      console.log('wow');

      return NextResponse.json({ message: error }, { status: 400 });
   }
}
