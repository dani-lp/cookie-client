import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { Button } from '@/components/Elements/Button';

const Logo = () => {
  return (
    <Link to='./'>
      <div className='mr-2 cursor-pointer flex items-center justify-center'>
        <img
          src={logo}
          alt="logo"
          className='h-10 w-10 m-1 md:m-2.5'
        />
      </div>
    </Link>
  );
};

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className='absolute top-0 w-screen h-16 bg-white shadow flex justify-center z-10'>
      <div className='max-w-7xl h-full w-full px-3 flex items-center justify-between'>
        <div className='flex items-center h-full'>
          <Logo />
        </div>
        <div className='flex items-center gap-4'>
          <Button
            size='sm'
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant='inverseBlack'
            size='sm'
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className='h-screen pt-16 pb-14 sm:pb-0 flex overflow-hidden bg-slate-100'>
      <Topbar />
      <main className='flex-1 relative overflow-y-auto focus:outline-none max-w-7xl mx-auto sm:px-6 py-2 md:px-8'>
        {children}
      </main>
    </div>
  );
};