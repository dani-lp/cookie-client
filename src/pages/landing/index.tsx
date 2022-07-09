import * as React from 'react';

export const Landing = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Home';
  }, []);

  return (
    <div>Landing</div>
  );
};