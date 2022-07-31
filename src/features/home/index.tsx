import { Dashboard } from './Dashboard';
import { Landing } from './Landing';

import { useStore } from '@/store/useStore';

export const Home = () => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Landing />;
  } else {
    return <Dashboard />;
  }
};