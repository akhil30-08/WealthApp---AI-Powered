import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
   const user = await currentUser();

   if (!user) {
      return NextResponse.json({ message: 'No User' }, { status: 400 });
   }

   try {
      const loggedInUser = await prisma.user.findUnique({
         where: {
            clerkUserId: user.id,
         },
      });

      if (loggedInUser) {
         return NextResponse.json({ message: 'User exists in Database' }, { status: 400 });
      }

      const newUser = await prisma.user.create({
         data: {
            clerkUserId: user.id,
            imageUrl: user.imageUrl,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
         },
      });

      return NextResponse.json({ message: 'User created succesfully in database', user: newUser }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         {
            message: 'Something went wrong',
            error,
         },
         { status: 400 }
      );
   }
}
