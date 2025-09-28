import EmailTemplate from '@/components/emails/Example-email';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
   try {
      const { percentageUsed, budgetAmount, totalExpenses } = await request.json();

      const { data, error } = await resend.emails.send({
         from: 'Wealth AI <onboarding@resend.dev>',
         to: ['akhilmahajan9796@gmail.com'],
         subject: 'Budget Alert for Akhil Mahajan',
         react: EmailTemplate({
            userName: 'Akhil Mahajan',
            type: 'budget-alert',
            data: {
               percentageUsed,
               budgetAmount,
               totalExpenses,
            },
         }),
      });

      if (error) {
         return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
   } catch (error) {
      return Response.json({ error }, { status: 500 });
   }
}
