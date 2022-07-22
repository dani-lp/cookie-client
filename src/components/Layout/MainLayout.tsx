import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArchiveIcon,
  BeakerIcon,
  BookmarkAltIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { axios } from '../../lib/axios';

import logo from '../../assets/logo.png';
import { Button } from '../Elements/Button';
import { ConfirmModal } from '../Overlay/ConfirmModal';
import { useStore } from '../../store/useStore';

type NavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const navigation = [
  { name: 'Recipes', to: './recipes', icon: BookmarkAltIcon },
  { name: 'Fridge', to: './fridge', icon: ArchiveIcon },
  { name: 'Explore', to: './explore', icon: BeakerIcon },
] as NavigationItem[];

const MobileNavigation = () => {
  return (
    <>
      {navigation.map((item, index) => (
        <NavLink
          end={index === 0}
          key={item.name}
          to={item.to}
          className={({ isActive }) => 'border-2 border-transparent group flex flex-col items-center justify-center text-xs font-light h-full w-full hover:text-violet-600' + (isActive ? ' text-violet-500 font-medium border-b-violet-500' : ' text-gray-400')}
        >
          <item.icon
            className="h-6 w-6 transition-colors"
            aria-hidden="true"
          />
          <span className="transition-colors">{item.name}</span>
        </NavLink>
      ))}
    </>
  );
};

const MobileBottombar = () => {
  return (
    <nav className={`w-screen sm:hidden ${document.activeElement ? 'absolute' : 'fixed'} bottom-0 z-50 h-14 shadow bg-gray-50 flex items-center justify-around`}>
      <MobileNavigation />
    </nav>
  );
};

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

const TopNavigation = () => {
  return (
    <>
      {navigation.map((item, index) => (
        <NavLink
          end={index === 0}
          key={item.name}
          to={item.to}
          className={isActive => 'border-2 border-transparent h-full flex items-center justify-center mx-1.5 md:mx-2 hover:text-violet-600' + (isActive.isActive ? ' text-violet-500 font-medium border-b-violet-500' : ' text-gray-400')}
        >
          <item.icon
            className="h-6 w-6 mr-2"
            aria-hidden="true"
          />
          <span className='transition-colors'>{item.name}</span>
        </NavLink>
      ))}
    </>
  );
};

const Topbar = () => {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const setUser = useStore((state) => state.setUser);

  const logoutHandler = () => {
    // TODO use improved useFetch
    axios.post('/auth/logout')
      .then(result => {
        console.log(result);
        setUser(null);
        // TODO navigate directly to /login without content flash
      }).catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <div className='absolute top-0 w-screen h-16 bg-white shadow flex justify-center z-10'>
        <div className='max-w-7xl h-full w-full px-3 flex items-center justify-between'>
          <div className='flex items-center h-full'>
            <Logo />
            <nav className='hidden sm:flex items-center h-full'>
              <TopNavigation />
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            {/* TODO user menu */}
            <Button
              size='xs'
              onClick={() => setLogoutModalOpen(true)}
            >
              <LogoutIcon className="text-white h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={logoutModalOpen}
        setOpen={setLogoutModalOpen}
        title="Log out"
        content="Are you sure you want to log out of Cookie?"
        acceptText="Log out"
        acceptCallback={logoutHandler}
      />
    </>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className='h-screen pt-16 pb-14 sm:pb-0 flex overflow-hidden bg-slate-100'>
      <MobileBottombar />
      <Topbar />
      <main className='flex-1 relative overflow-y-auto focus:outline-none max-w-7xl mx-auto sm:px-6 sm:py-2 md:px-8'>
        {children}
      </main>
    </div>
  );
};