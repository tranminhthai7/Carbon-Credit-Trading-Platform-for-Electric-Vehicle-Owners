import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './auth/AuthContext';
import RequireRole from './auth/RequireRole';
import OwnerLayout from './layouts/OwnerLayout';
import BuyerLayout from './layouts/BuyerLayout';
import CvaLayout from './layouts/CvaLayout';
import AdminLayout from './layouts/AdminLayout';
import OwnerHome from './pages/owner/OwnerHome';
import BuyerHome from './pages/buyer/BuyerHome';
import CvaHome from './pages/cva/CvaHome';
import AdminHome from './pages/admin/AdminHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Marketplace /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        element: <RequireRole allow={['EV_OWNER']} />,
        children: [
          { path: 'owner', element: <OwnerLayout />, children: [
            { index: true, element: <OwnerHome /> },
            { path: 'trips', lazy: async () => ({ Component: (await import('./pages/owner/Trips')).default }) },
            { path: 'issuance', lazy: async () => ({ Component: (await import('./pages/owner/Issuance')).default }) },
            { path: 'wallet', lazy: async () => ({ Component: (await import('./pages/owner/Wallet')).default }) },
            { path: 'listings', lazy: async () => ({ Component: (await import('./pages/owner/Listings')).default }) }
          ] }
        ]
      },
      {
        element: <RequireRole allow={['BUYER']} />,
        children: [
          { path: 'buyer', element: <BuyerLayout />, children: [{ index: true, element: <BuyerHome /> }] }
        ]
      },
      {
        element: <RequireRole allow={['CVA']} />,
        children: [
          { path: 'cva', element: <CvaLayout />, children: [{ index: true, element: <CvaHome /> }] }
        ]
      },
      {
        element: <RequireRole allow={['ADMIN']} />,
        children: [
          { path: 'admin', element: <AdminLayout />, children: [{ index: true, element: <AdminHome /> }] }
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);


