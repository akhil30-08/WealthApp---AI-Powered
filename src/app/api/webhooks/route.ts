import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
   const SIGNING_SECRET = process.env.SIGNING_SECRET;

   if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
   }

   const wh = new Webhook(SIGNING_SECRET);
   const headerPayload = await headers();
   const svix_id = headerPayload.get('svix-id');
   const svix_timestamp = headerPayload.get('svix-timestamp');
   const svix_signature = headerPayload.get('svix-signature');

   if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error: Missing Svix headers', {
         status: 400,
      });
   }

   const payload = await req.json();
   const body = JSON.stringify(payload);

   let evt: WebhookEvent;

   try {
      evt = wh.verify(body, {
         'svix-id': svix_id,
         'svix-timestamp': svix_timestamp,
         'svix-signature': svix_signature,
      }) as WebhookEvent;
   } catch (err) {
      console.error('Error: Could not verify webhook:', err);
      return new Response('Error: Verification error', {
         status: 400,
      });
   }

   const eventType = evt.type;

   try {
      if (eventType === 'user.created') {
         const { id, email_addresses, first_name, last_name, image_url } = evt.data;

         const existingUser = await prisma.user.findUnique({
            where: { clerkUserId: id },
         });

         if (existingUser) {
            console.log(`User already exists.`);
            return new Response('User already exists', { status: 400 });
         }

         const newUser = await prisma.user.create({
            data: {
               clerkUserId: id,
               email: email_addresses[0].email_address,
               name: `${first_name} ${last_name}`,
               imageUrl: image_url,
            },
         });

         console.log(`User created successfully: ${newUser.id}`);
         return new Response('User created successfully', { status: 200 });
      }

      console.log(`Unhandled event type: ${eventType}`);
      return new Response('Event type not handled', { status: 200 });
   } catch (error) {
      console.error('Error handling webhook event:', error);
      return new Response('Internal Server Error', { status: 500 });
   }
}
