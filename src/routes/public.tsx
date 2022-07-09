import { Navigate, Outlet } from 'react-router';

import { PublicLayout } from '../components/Layout/PublicLayout';
import { Home, Login, Register } from '../pages';

const App = () => {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

// TODO add auth routes (login, logout)

export const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="." /> },
    ]
  }
];