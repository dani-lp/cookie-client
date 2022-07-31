import { Navigate, Outlet } from 'react-router';

import { MainLayout } from '../components/Layout';
import { Recipes, RecipeDetail, Fridge, Explore, Home } from '../features';

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
      { path: '/recipes/:id', element: <RecipeDetail /> },
      { path: '/recipes', element: <Recipes /> },
      { path: '/fridge', element: <Fridge /> },
      { path: '/explore', element: <Explore /> },
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];