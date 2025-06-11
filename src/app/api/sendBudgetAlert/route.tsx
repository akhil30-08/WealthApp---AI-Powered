import { render } from '@react-email/render';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { NextRequest, NextResponse } from 'next/server';
import EmailTemplate from '../../../../emails/example-email';

const mailerSend = new MailerSend({
   apiKey: process.env.MAILERSEND_API_KEY || '',
});

export async function POST(request: NextRequest) {
   try {
      const { userName, type, data } = await request.json();

      const sentFrom = new Sender('test@test-69oxl5evmzzl785k.mlsender.net', 'Akhil Mahajan');

      const recipients = [new Recipient('akhilm.jmu@yahoo.com', 'Recipient')];

      const emailHtml = await render(
         <EmailTemplate
            userName={userName}
            type={type}
            data={data}
         />
      );

      const emailParams = new EmailParams().setFrom(sentFrom).setTo(recipients).setSubject('Budget Alert').setHtml(emailHtml);

      await mailerSend.email.send(emailParams);
      return NextResponse.json({ message: 'Mail Sent' }, { status: 200 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Failed to Send Email' }, { status: 400 });
   }
}
