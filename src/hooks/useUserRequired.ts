import * as React from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '@/store/useStore';
import { axios } from '@/lib/axios';


export const useUserRequired = (): boolean => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const { user, setUser } = useStore((state) => ({
    user: state.user,
    setUser: state.setUser
  }), shallow);

  React.useEffect(() => {
    let ignore = false;

    if (user === null && !ignore) {
      axios.get('/auth/self')
        .then(result => {
          setUser(result.data);
          setLoaded(true);
        }).catch(err => {
          console.log(err);
          setLoaded(true);
        });
    }
    return () => {
      ignore = true;
    };
  }, [user, setUser]);

  return loaded;
};