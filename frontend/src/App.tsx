import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserRole } from './types';
import DashboardRedirect from './pages/common/DashboardRedirect';
import PublicDashboard from './pages/common/PublicDashboard';
import RootRedirect from './pages/common/RootRedirect';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { TripsPage } from './pages/owner/TripsPage';
import { WalletPage } from './pages/owner/WalletPage';
import { ListingsPage } from './pages/owner/ListingsPage';
import { VehiclesPage } from './pages/owner/VehiclesPage';
import { OrdersPage as OwnerOrdersPage } from './pages/owner/OrdersPage';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { MarketplacePage } from './pages/buyer/MarketplacePage';
import { OrdersPage } from './pages/buyer/OrdersPage';
import { CertificatesPage } from './pages/buyer/CertificatesPage';
import { CVADashboard } from './pages/cva/CVADashboard';
import { VerificationsPage } from './pages/cva/VerificationsPage';
import { CVAReportsPage } from './pages/cva/CVAReportsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DevLogin from './pages/dev/DevLogin';
import ProfilePage from './pages/common/ProfilePage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';
import { UsersPage } from './pages/admin/UsersPage';
import { TransactionsPage } from './pages/admin/TransactionsPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dev-login" element={<DevLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/owner/*" element={<ProtectedRoute allowedRoles={[UserRole.EV_OWNER]}><DashboardLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<OwnerDashboard />} /><Route path="trips" element={<TripsPage />} /><Route path="wallet" element={<WalletPage />} /><Route path="listings" element={<ListingsPage />} /><Route path="vehicles" element={<VehiclesPage />} /><Route path="orders" element={<OwnerOrdersPage />} /></Routes></DashboardLayout></ProtectedRoute>} />
            <Route path="/buyer/*" element={<ProtectedRoute allowedRoles={[UserRole.BUYER]}><DashboardLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<BuyerDashboard />} /><Route path="marketplace" element={<MarketplacePage />} /><Route path="orders" element={<OrdersPage />} /><Route path="certificates" element={<CertificatesPage />} /></Routes></DashboardLayout></ProtectedRoute>} />
            <Route path="/cva/*" element={<ProtectedRoute allowedRoles={[UserRole.VERIFIER]}><DashboardLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<CVADashboard />} /><Route path="verifications" element={<VerificationsPage />} /><Route path="reports" element={<CVAReportsPage />} /></Routes></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><DashboardLayout><Routes><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<AdminDashboard />} /><Route path="users" element={<UsersPage />} /><Route path="transactions" element={<TransactionsPage />} /><Route path="analytics" element={<AnalyticsPage />} /><Route path="settings" element={<SettingsPage />} /></Routes></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard" element={<PublicDashboard />} />
              <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;