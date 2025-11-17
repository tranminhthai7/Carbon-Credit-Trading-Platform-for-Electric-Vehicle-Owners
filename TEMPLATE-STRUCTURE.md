# 📁 TEMPLATE STRUCTURE - Material-UI Dashboard

Cấu trúc folder và file template cho Carbon Credit Trading Platform

---

## 🎨 FOLDER STRUCTURE HOÀN CHỈNH

```
frontend/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── favicon.ico
│   │   │   └── illustrations/
│   │   │       ├── empty-state.svg
│   │   │       ├── error-404.svg
│   │   │       └── success.svg
│   │   └── icons/
│   └── index.html
│
├── src/
│   ├── components/                    # Reusable components
│   │   ├── common/
│   │   │   ├── ProtectedRoute.tsx    ✅ Done
│   │   │   ├── LoadingScreen.tsx     ⏳ To implement
│   │   │   ├── ErrorBoundary.tsx     ⏳ To implement
│   │   │   ├── EmptyState.tsx        ⏳ To implement
│   │   │   └── ConfirmDialog.tsx     ⏳ To implement
│   │   │
│   │   ├── charts/                    # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── AreaChart.tsx
│   │   │
│   │   ├── forms/                     # Form components
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormDatePicker.tsx
│   │   │   └── FormFileUpload.tsx
│   │   │
│   │   ├── tables/                    # Table components
│   │   │   ├── DataTable.tsx
│   │   │   ├── TablePagination.tsx
│   │   │   └── TableActions.tsx
│   │   │
│   │   └── cards/                     # Card components
│   │       ├── StatsCard.tsx
│   │       ├── InfoCard.tsx
│   │       └── ChartCard.tsx
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.tsx       ✅ Done
│   │   ├── AuthLayout.tsx            ⏳ To implement
│   │   └── components/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── pages/
│   │   ├── auth/                     ✅ Done
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── owner/                    ⏳ Need implementation
│   │   │   ├── OwnerDashboard.tsx    (Skeleton done)
│   │   │   ├── TripsPage.tsx         (Skeleton done)
│   │   │   ├── WalletPage.tsx        (Skeleton done)
│   │   │   ├── ListingsPage.tsx      (Skeleton done)
│   │   │   └── components/
│   │   │       ├── TripForm.tsx
│   │   │       ├── TripCard.tsx
│   │   │       ├── WalletBalance.tsx
│   │   │       └── ListingForm.tsx
│   │   │
│   │   ├── buyer/                    ⏳ Need implementation
│   │   │   ├── BuyerDashboard.tsx    (Skeleton done)
│   │   │   ├── MarketplacePage.tsx   (Skeleton done)
│   │   │   ├── OrdersPage.tsx        (Skeleton done)
│   │   │   ├── CertificatesPage.tsx  (Skeleton done)
│   │   │   └── components/
│   │   │       ├── ListingCard.tsx
│   │   │       ├── PurchaseDialog.tsx
│   │   │       ├── OrderCard.tsx
│   │   │       └── CertificateCard.tsx
│   │   │
│   │   ├── cva/                      ⏳ Need implementation
│   │   │   ├── CVADashboard.tsx      (Skeleton done)
│   │   │   ├── VerificationsPage.tsx (Skeleton done)
│   │   │   ├── CVAReportsPage.tsx    (Skeleton done)
│   │   │   └── components/
│   │   │       ├── VerificationCard.tsx
│   │   │       ├── ApprovalDialog.tsx
│   │   │       └── ReportChart.tsx
│   │   │
│   │   ├── admin/                    ⏳ Need implementation
│   │   │   ├── AdminDashboard.tsx    (Skeleton done)
│   │   │   ├── UsersPage.tsx         (Skeleton done)
│   │   │   ├── TransactionsPage.tsx  (Skeleton done)
│   │   │   ├── AnalyticsPage.tsx     (Skeleton done)
│   │   │   ├── SettingsPage.tsx      (Skeleton done)
│   │   │   └── components/
│   │   │       ├── UserForm.tsx
│   │   │       ├── SettingsForm.tsx
│   │   │       └── AnalyticsChart.tsx
│   │   │
│   │   └── ErrorPage.tsx
│   │
│   ├── services/                     ✅ Done (Need integration)
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── trip.service.ts
│   │   ├── wallet.service.ts
│   │   ├── marketplace.service.ts
│   │   ├── verification.service.ts
│   │   └── report.service.ts
│   │
│   ├── context/                      ✅ Done
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx          ⏳ To implement
│   │   └── NotificationContext.tsx   ⏳ To implement
│   │
│   ├── hooks/                        ⏳ To implement
│   │   ├── useAuth.ts
│   │   ├── useAPI.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useNotification.ts
│   │
│   ├── utils/                        ⏳ To implement
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/                        ✅ Done
│   │   └── index.ts
│   │
│   ├── theme/                        ✅ Done (Can extend)
│   │   ├── index.ts
│   │   ├── palette.ts                ⏳ To extract
│   │   ├── typography.ts             ⏳ To extract
│   │   └── components.ts             ⏳ To extract
│   │
│   ├── App.tsx                       ✅ Done
│   ├── main.tsx                      ✅ Done
│   └── vite-env.d.ts                 ✅ Done
│
├── .env.example                      ✅ Done
├── package.json                      ✅ Done
├── tsconfig.json
├── vite.config.ts
└── Dockerfile                        ✅ Done
```

---

## 📝 FILE TEMPLATES

### 1. **Component Template**

```typescript
// frontend/src/components/common/LoadingScreen.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
```

### 2. **Page Template**

```typescript
// frontend/src/pages/[role]/[PageName].tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';

export const PageName: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // API call
      setLoading(true);
      // const result = await service.getData();
      // setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Page Title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page description
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add New
        </Button>
      </Box>

      {/* Content */}
      <Card>
        <CardContent>
          {/* Your content here */}
        </CardContent>
      </Card>
    </Box>
  );
};
```

### 3. **Service Template**

```typescript
// frontend/src/services/[name].service.ts
import { apiClient } from './api';
import { EntityType } from '../types';

export const entityService = {
  // Get all
  getAll: async (): Promise<EntityType[]> => {
    const response = await apiClient.get<EntityType[]>('/api/entities');
    return response.data;
  },

  // Get by ID
  getById: async (id: string): Promise<EntityType> => {
    const response = await apiClient.get<EntityType>(`/api/entities/${id}`);
    return response.data;
  },

  // Create
  create: async (data: Partial<EntityType>): Promise<EntityType> => {
    const response = await apiClient.post<EntityType>('/api/entities', data);
    return response.data;
  },

  // Update
  update: async (id: string, data: Partial<EntityType>): Promise<EntityType> => {
    const response = await apiClient.put<EntityType>(`/api/entities/${id}`, data);
    return response.data;
  },

  // Delete
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/entities/${id}`);
  },
};
```

### 4. **Hook Template**

```typescript
// frontend/src/hooks/useAPI.ts
import { useState, useEffect } from 'react';

interface UseAPIOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
}

interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAPI<T>({ 
  fetchFn, 
  dependencies = [] 
}: UseAPIOptions<T>): UseAPIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}
```

### 5. **Dialog Template**

```typescript
// frontend/src/components/common/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'warning',
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle display="flex" alignItems="center" gap={1}>
        {severity === 'warning' && <Warning color="warning" />}
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === 'error' ? 'error' : 'primary'}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### 6. **Form Component Template**

```typescript
// frontend/src/components/forms/FormInput.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>;
  rules?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  rules,
  ...textFieldProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};
```

### 7. **Stats Card Template**

```typescript
// frontend/src/components/cards/StatsCard.tsx
import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = '#2e7d32',
  trend,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Typography 
                variant="caption" 
                color={trend.isPositive ? 'success.main' : 'error.main'}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Typography>
            )}
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### 8. **Utils - Formatters**

```typescript
// frontend/src/utils/formatters.ts

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format distance
 */
export const formatDistance = (km: number): string => {
  return `${km.toFixed(2)} km`;
};

/**
 * Format carbon amount
 */
export const formatCarbon = (kg: number): string => {
  return `${kg.toFixed(2)} kg CO₂`;
};
```

### 9. **Utils - Validators**

```typescript
// frontend/src/utils/validators.ts

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 */
export const isValidPassword = (password: string): boolean => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Phone validation (Vietnamese format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Number validation
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};
```

### 10. **Constants**

```typescript
// frontend/src/utils/constants.ts

export const APP_NAME = 'Carbon Credit Trading Platform';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout',
    PROFILE: '/api/users/profile',
  },
  TRIPS: {
    LIST: '/api/vehicles/trips/user',
    CREATE: '/api/vehicles/trips',
    GET: (id: string) => `/api/vehicles/trips/${id}`,
  },
  WALLET: {
    GET: '/api/wallet',
    TRANSACTIONS: '/api/wallet/transactions',
  },
  MARKETPLACE: {
    LISTINGS: '/api/listings',
    MY_LISTINGS: '/api/listings/seller',
    PURCHASE: '/api/listings/purchase',
  },
};

export const ROLE_LABELS = {
  ev_owner: 'EV Owner',
  buyer: 'Buyer',
  cva: 'Carbon Verifier',
  admin: 'Administrator',
};

export const STATUS_COLORS = {
  PENDING: 'warning',
  VERIFIED: 'success',
  REJECTED: 'error',
  ACTIVE: 'success',
  COMPLETED: 'info',
  CANCELLED: 'default',
} as const;

export const CARBON_EMISSION_FACTOR = 0.12; // kg CO2 per km for ICE vehicles
```

---

## 🎨 THEME CUSTOMIZATION

### Extended Theme

```typescript
// frontend/src/theme/palette.ts
export const palette = {
  primary: {
    main: '#2e7d32',
    light: '#60ad5e',
    dark: '#005005',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#1976d2',
    light: '#63a4ff',
    dark: '#004ba0',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4caf50',
    light: '#80e27e',
    dark: '#087f23',
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
  },
  warning: {
    main: '#ff9800',
    light: '#ffc947',
    dark: '#c66900',
  },
  info: {
    main: '#2196f3',
    light: '#6ec6ff',
    dark: '#0069c0',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};
```

```typescript
// frontend/src/theme/typography.ts
export const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.43,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};
```

---

## 📦 RECOMMENDED PACKAGES

### Additional Packages to Install

```bash
# Form handling
npm install react-hook-form yup @hookform/resolvers

# Date handling
npm install date-fns

# File upload
npm install react-dropzone

# Charts (if not using MUI X-Charts)
npm install recharts apexcharts react-apexcharts

# Notifications
npm install notistack

# Icons
npm install @mui/icons-material

# PDF generation
npm install jspdf html2canvas

# Excel export
npm install xlsx

# QR Code
npm install qrcode.react
```

---

## 🔧 VITE CONFIG

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
});
```

---

## ✅ CHECKLIST FOR EACH PAGE

Khi implement mỗi page, đảm bảo:

- [ ] **Data Fetching**
  - [ ] useEffect với dependency array đúng
  - [ ] Loading state
  - [ ] Error handling
  - [ ] Empty state

- [ ] **UI/UX**
  - [ ] Responsive design (mobile, tablet, desktop)
  - [ ] Loading indicators
  - [ ] Error messages
  - [ ] Success feedback
  - [ ] Confirmation dialogs

- [ ] **Forms**
  - [ ] Validation rules
  - [ ] Error messages
  - [ ] Submit handling
  - [ ] Reset functionality
  - [ ] Disabled state during submit

- [ ] **Tables/Lists**
  - [ ] Pagination
  - [ ] Sorting
  - [ ] Filtering
  - [ ] Search
  - [ ] Actions (Edit, Delete)

- [ ] **Performance**
  - [ ] Memoization (useMemo, useCallback)
  - [ ] Lazy loading
  - [ ] Code splitting
  - [ ] Image optimization

---

**Happy Coding! 🚀**
