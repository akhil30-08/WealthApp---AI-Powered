import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/logo.png';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { LayoutDashboardIcon, PenBox } from 'lucide-react';

const Header = () => {
   return (
      <header className='py-5 max-sm:py-3 px-2 border-b flex justify-between items-center bg-white/80'>
         <Link href='/'>
            <Image
               alt='Logo'
               src={logo}
               className='w-14 h-10 md:w-28 md:h-11 object-contain'
            />
         </Link>

         <div>
            <SignedOut>
               <SignInButton>
                  <Button variant='outline'>Login</Button>
               </SignInButton>
            </SignedOut>
            <SignedIn>
               <div className='flex justify-start items-center gap-3'>
                  <Link href='/dashboard'>
                     <Button variant={'secondary'}>
                        <LayoutDashboardIcon />
                        <span className='hidden md:inline'>Dashboard</span>
                     </Button>
                  </Link>

                  <Link href='/transaction'>
                     <Button>
                        <PenBox />
                        <span className='hidden md:inline'>Add Transaction</span>
                     </Button>
                  </Link>
                  <UserButton />
               </div>
            </SignedIn>
         </div>
      </header>
   );
};

export default Header;
