import * as React from 'react';

export const Landing = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Welcome!';
  }, []);

  return (
    <div>Landing</div>
  );
};