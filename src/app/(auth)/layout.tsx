import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'LogIn/SignUp',
};

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return <main className='flex justify-center p-10 bg-gray-400'>{children}</main>;
}
