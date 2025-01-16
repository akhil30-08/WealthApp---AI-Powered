import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   const { id } = await params;

   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const account = await prisma.account.findUnique({
         where: {
            id,
         },
      });

      if (!account) {
         return NextResponse.json({ message: "This account doesn't exist" }, { status: 400 });
      }

      await prisma.account.update({
         where: {
            id,
         },
         data: {
            isDefault: !account.isDefault,
         },
      });

      return NextResponse.json({ message: 'Account updated' }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 400 });
   }
}
