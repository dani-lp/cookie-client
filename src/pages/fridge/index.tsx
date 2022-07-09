import * as React from 'react';

export const Fridge = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Fridge';
  }, []);

  return (
    <div></div>
  );
};