import * as React from 'react';

export const Dashboard = () => {
  React.useEffect(() => {
    document.title = 'Cookie - Home';
  }, []);

  return (
    <div>Dashboard</div>
  );
};