import * as React from 'react';

// TODO Fridge store of recipes
export const Fridge = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Fridge';
  }, []);

  return (
    <div>Fridge</div>
  );
};