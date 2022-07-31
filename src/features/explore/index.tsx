import * as React from 'react';

// TODO grid-like recipe list, with search bar
export const Explore = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Explore';
  }, []);

  return (
    <div>Explore</div>
  );
};