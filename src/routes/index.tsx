import { useRoutes } from 'react-router-dom';

import { publicRoutes } from './public';
import { protectedRoutes } from './protected';
import { useUserRequired } from '../hooks/useUserRequired';
import { Spinner } from '../components/Elements/Spinner';
import { useStore } from '../store/useStore';

export const AppRoutes = () => {
  const user = useStore((state) => state.user);
  const userLoaded = useUserRequired();

  const routes = user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes]);

  if (!userLoaded) {
    // TODO add logo on top
    return (
      <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Spinner size='xl' />
        <h1 className='mt-10 text-3xl font-light'>Please wait...</h1>
      </div>
    );
  }

  return <>{element}</>;
};