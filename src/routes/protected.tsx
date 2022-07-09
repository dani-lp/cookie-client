import { Navigate, Outlet } from 'react-router';

import { MainLayout } from '../components/Layout';
import { Recipes, Fridge, Explore, Landing } from '../pages';

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/recipes', element: <Recipes /> },
      { path: '/fridge', element: <Fridge /> },
      { path: '/explore', element: <Explore /> },
      { path: '/', element: <Landing /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];