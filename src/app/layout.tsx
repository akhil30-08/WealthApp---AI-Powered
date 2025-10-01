import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
   subsets: ['latin'],
});

export const metadata: Metadata = {
   title: 'Manage Wealth',
   description: 'Manage your wealth with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <ClerkProvider>
         <html lang='en'>
            <body className={inter.className}>
               <NextTopLoader showSpinner={false} />

               <Header />
               <main>{children}</main>
               {/* ///TODO check this later because it is glitchy */}
               <Toaster />
            </body>
         </html>
      </ClerkProvider>
   );
}
