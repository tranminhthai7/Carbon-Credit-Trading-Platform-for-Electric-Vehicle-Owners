# 🎨 FRONTEND COMPONENTS USAGE GUIDE

Hướng dẫn sử dụng các components có sẵn trong dự án

---

## ✅ ĐÃ TẠO - READY TO USE

### 📦 Common Components

#### 1. **LoadingSpinner**
```tsx
import { LoadingSpinner } from '@/components/common';

// Basic usage
<LoadingSpinner />

// Custom message
<LoadingSpinner message="Loading trips..." />

// Custom size & no full height
<LoadingSpinner message="Uploading..." size={30} fullHeight={false} />
```

#### 2. **ErrorMessage**
```tsx
import { ErrorMessage } from '@/components/common';

<ErrorMessage
  title="Failed to load data"
  message="Could not connect to server. Please check your internet connection."
  onRetry={() => fetchData()}
/>
```

#### 3. **EmptyState**
```tsx
import { EmptyState } from '@/components/common';
import { DirectionsCar } from '@mui/icons-material';

<EmptyState
  title="No trips yet"
  message="Start recording your EV trips to earn carbon credits!"
  icon={<DirectionsCar sx={{ fontSize: 64, color: 'primary.main' }} />}
  actionLabel="Record Your First Trip"
  onAction={() => setOpenDialog(true)}
/>
```

#### 4. **StatCard** - Đã Update
```tsx
import { StatCard } from '@/components/common';
import { Nature } from '@mui/icons-material';

<Grid item xs={12} sm={6} md={3}>
  <StatCard
    title="Carbon Saved"
    value="245.50 kg"
    icon={<Nature sx={{ fontSize: 28 }} />}
    color="#4caf50"
    trend={{
      value: 15,      // ← Positive = TrendingUp, Negative = TrendingDown
      label: 'vs last month',
    }}
    loading={false}   // ← Shows skeleton when true
  />
</Grid>
```

#### 5. **ConfirmDialog**
```tsx
import { ConfirmDialog } from '@/components/common';
import { useState } from 'react';

const [openConfirm, setOpenConfirm] = useState(false);
const [deleting, setDeleting] = useState(false);

const handleDelete = async () => {
  setDeleting(true);
  await deleteTrip(tripId);
  setDeleting(false);
  setOpenConfirm(false);
};

<ConfirmDialog
  open={openConfirm}
  title="Delete Trip?"
  message="This action cannot be undone. Are you sure you want to delete this trip?"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  confirmColor="error"
  onConfirm={handleDelete}
  onCancel={() => setOpenConfirm(false)}
  loading={deleting}
/>
```

---

### 🎣 Custom Hooks

#### 1. **useDebounce** - Delay updates
```tsx
import { useDebounce } from '@/hooks';
import { useState, useEffect } from 'react';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500); // ← Delay 500ms

useEffect(() => {
  if (debouncedSearch) {
    // Call API only after user stops typing for 500ms
    searchTrips(debouncedSearch);
  }
}, [debouncedSearch]);

<TextField
  label="Search trips..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

#### 2. **useLocalStorage** - Persist state
```tsx
import { useLocalStorage } from '@/hooks';

// Store theme preference
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

// Store user preferences
const [filters, setFilters] = useLocalStorage('tripFilters', {
  status: 'ALL',
  dateRange: 'month',
});

<Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle Theme
</Button>
```

#### 3. **usePagination** - Client-side pagination
```tsx
import { usePagination } from '@/hooks';

const trips = [...]; // Your data array

const {
  paginatedData,      // ← Current page data
  currentPage,
  totalPages,
  pageSize,
  nextPage,
  previousPage,
  goToPage,
  canGoNext,
  canGoPrevious,
  setPageSize,
} = usePagination(trips, { initialPageSize: 10 });

// Display paginated data
<DataTable data={paginatedData} />

// Pagination controls
<Box display="flex" gap={1}>
  <Button onClick={previousPage} disabled={!canGoPrevious}>
    Previous
  </Button>
  <Typography>Page {currentPage} of {totalPages}</Typography>
  <Button onClick={nextPage} disabled={!canGoNext}>
    Next
  </Button>
</Box>

// Change page size
<Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
  <MenuItem value={5}>5</MenuItem>
  <MenuItem value={10}>10</MenuItem>
  <MenuItem value={25}>25</MenuItem>
</Select>
```

#### 4. **useAsync** - Handle async operations
```tsx
import { useAsync } from '@/hooks';
import { useEffect } from 'react';

const { data, loading, error, execute, reset } = useAsync(
  async (userId: string) => {
    return await reportService.getPersonalStats(userId);
  }
);

useEffect(() => {
  execute(user.id);
}, [user.id]);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={() => execute(user.id)} />;
if (!data) return null;

return <Dashboard stats={data} />;
```

---

### 📝 Form Components

#### **TripFormDialog** - Đã Update
```tsx
import { TripFormDialog } from '@/components/forms/TripFormDialog';
import { useState } from 'react';

const [openForm, setOpenForm] = useState(false);

const handleSuccess = () => {
  // Refresh trips list
  fetchTrips();
  // Show success message (Snackbar)
  showNotification('Trip recorded successfully!');
};

<Button onClick={() => setOpenForm(true)}>
  Record New Trip
</Button>

<TripFormDialog
  open={openForm}
  onClose={() => setOpenForm(false)}
  onSuccess={handleSuccess}
/>
```

**Features:**
- ✅ Full validation (distance, energy, time)
- ✅ Error handling with alerts
- ✅ Loading states
- ✅ Auto-reset form on close
- ✅ Informative helper text
- ✅ Responsive design

---

## 🎯 USAGE EXAMPLES - PAGES

### **Updated OwnerDashboard.tsx**
```tsx
import { LoadingSpinner, StatCard } from '@/components/common';

// ✅ Using LoadingSpinner
if (loading) {
  return <LoadingSpinner message="Loading dashboard..." />;
}

// ✅ Using StatCard with trends
<StatCard
  title="Total Trips"
  value={stats?.totalTrips || 0}
  icon={<DirectionsCar />}
  color="#2e7d32"
  trend={{ value: 12, label: 'vs last month' }}
/>

// ✅ Quick action buttons with navigation
<Button startIcon={<Add />} onClick={() => navigate('/owner/trips')}>
  Record a new trip
</Button>
```

### **Updated TripsPage.tsx**
```tsx
import { TripFormDialog } from '@/components/forms/TripFormDialog';
import { LoadingSpinner, EmptyState } from '@/components/common';

// ✅ Using LoadingSpinner
if (loading) return <LoadingSpinner message="Loading trips..." />;

// ✅ Using EmptyState when no data
{trips.length === 0 ? (
  <EmptyState
    title="No trips yet"
    message="Start recording your EV trips to earn carbon credits!"
    actionLabel="Record Your First Trip"
    onAction={() => setOpenForm(true)}
  />
) : (
  <DataGrid rows={trips} columns={columns} />
)}

// ✅ Export to CSV functionality
const handleExportCSV = () => {
  const csvContent = [...headers, ...trips.map(formatRow)].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trips-${new Date().toISOString()}.csv`;
  link.click();
};

<Button startIcon={<Download />} onClick={handleExportCSV}>
  Export CSV
</Button>
```

---

## 💡 BEST PRACTICES

### 1. **Always use common components**
❌ Don't:
```tsx
if (loading) {
  return <CircularProgress />;
}
```

✅ Do:
```tsx
if (loading) {
  return <LoadingSpinner message="Loading..." />;
}
```

### 2. **Use hooks for common logic**
❌ Don't:
```tsx
const [value, setValue] = useState('');
const [debouncedValue, setDebouncedValue] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedValue(value), 500);
  return () => clearTimeout(timer);
}, [value]);
```

✅ Do:
```tsx
const [value, setValue] = useState('');
const debouncedValue = useDebounce(value, 500);
```

### 3. **Consistent error handling**
❌ Don't:
```tsx
catch (error) {
  alert('Error: ' + error.message);
}
```

✅ Do:
```tsx
catch (error) {
  setError(error.message);
}

{error && (
  <ErrorMessage
    message={error}
    onRetry={() => fetchData()}
  />
)}
```

### 4. **Use TypeScript properly**
✅ Always type your props:
```tsx
interface MyComponentProps {
  data: Trip[];
  onSelect: (trip: Trip) => void;
  loading?: boolean; // ← Optional
}

export const MyComponent: React.FC<MyComponentProps> = ({
  data,
  onSelect,
  loading = false, // ← Default value
}) => {
  // Component code
};
```

---

## 📚 NEXT COMPONENTS TO CREATE

Team members có thể tạo thêm:

### For Member 2 (Buyer):
- `ListingCard.tsx` - Card hiển thị carbon credit listing
- `PurchaseDialog.tsx` - Dialog mua carbon credits
- `FilterPanel.tsx` - Panel filter marketplace

### For Member 3 (CVA):
- `VerificationDialog.tsx` - Dialog approve/reject trips
- `TripDetailDialog.tsx` - Xem chi tiết trip
- `ApprovalTimeline.tsx` - Timeline verification process

### For Member 4 (Admin):
- `UserTable.tsx` - DataGrid cho users với actions
- `TransactionTable.tsx` - DataGrid cho transactions
- `AnalyticsChart.tsx` - Charts for analytics
- `SystemSettingsForm.tsx` - Form cấu hình system

### For Member 5 (Common):
- `SearchBar.tsx` - Search component với debounce
- `DateRangePicker.tsx` - Pick date range
- `Snackbar/Toast.tsx` - Notification system
- `ConfirmationDialog.tsx` - Generic confirm dialog

---

## 🚀 HOW TO CREATE NEW COMPONENT

### Template:
```tsx
// src/components/common/MyComponent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface MyComponentProps {
  title: string;
  data: any[];
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  data,
  onAction,
}) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {/* Component content */}
    </Box>
  );
};
```

### Add to index.ts:
```tsx
// src/components/common/index.ts
export { MyComponent } from './MyComponent';
```

### Usage:
```tsx
import { MyComponent } from '@/components/common';

<MyComponent title="Hello" data={myData} />
```

---

**Last Updated:** 10/11/2025  
**Created By:** AI Assistant  
**For:** Carbon Credit Trading Platform Team
