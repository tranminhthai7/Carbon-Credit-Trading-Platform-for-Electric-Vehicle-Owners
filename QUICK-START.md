# 🚀 QUICK START GUIDE - Cho Team Members

Hướng dẫn nhanh để bắt đầu làm việc với dự án

---

## 📋 PREREQUISITE

### Yêu cầu hệ thống
- **Node.js**: v18.x trở lên
- **npm**: v9.x trở lên
- **Docker Desktop**: Latest version (cho testing)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended)

### VS Code Extensions (Recommended)
```
- ESLint
- Prettier
- TypeScript and JavaScript
- ES7+ React/Redux/React-Native snippets
- Material Icon Theme
- GitLens
```

---

## 🔧 SETUP PROJECT

### 1. Clone Repository

```bash
git clone https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners.git
cd Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
```

### 2. Checkout Branch feat/api-gateway

```bash
git checkout feat/api-gateway
git pull origin feat/api-gateway
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Note:** Có thể mất 5-10 phút để cài đặt ~330+ packages

### 4. Create Environment File

```bash
# Frontend
cp .env.example .env

# Edit .env
VITE_API_BASE_URL=http://localhost:8000
```

### 5. Start Development Server

```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Mở browser: http://localhost:5173
```

### 6. Start Backend (Docker)

```bash
# Terminal 2: Start all services
cd ..
docker-compose up -d

# Check logs
docker-compose logs -f api-gateway
docker-compose logs -f user-service
```

---

## 🌿 GIT WORKFLOW

### Tạo Branch Mới Cho Feature

```bash
# Checkout từ feat/api-gateway
git checkout feat/api-gateway
git pull origin feat/api-gateway

# Tạo branch mới
git checkout -b feature/owner-module          # Người 2
git checkout -b feature/buyer-cva-module      # Người 3
git checkout -b feature/admin-module          # Người 4
git checkout -b feature/documentation         # Người 5
```

### Commit Changes

```bash
# Stage files
git add src/pages/owner/OwnerDashboard.tsx
git add src/pages/owner/TripsPage.tsx

# Commit với message rõ ràng
git commit -m "feat(owner): implement dashboard với real API integration

- Fetch stats từ /api/reports/personal/:userId
- Add charts cho carbon savings
- Implement loading states
- Add error handling"

# Push lên GitHub
git push origin feature/owner-module
```

### Commit Message Conventions

```
feat(scope): add new feature
fix(scope): bug fix
docs(scope): documentation changes
style(scope): formatting, no code change
refactor(scope): code refactoring
test(scope): add tests
chore(scope): maintenance tasks

Examples:
feat(owner): implement trip recording
fix(buyer): marketplace filter not working
docs(api): add API documentation
style(ui): improve button spacing
refactor(auth): optimize login flow
test(owner): add unit tests for trips
chore(deps): update dependencies
```

### Create Pull Request

1. Push branch lên GitHub
2. Vào GitHub repository
3. Click "Compare & pull request"
4. Fill in:
   - **Title**: Clear, concise description
   - **Description**: What changed, why, screenshots (if UI)
   - **Assignees**: @tranminhthai7 (Team Lead)
   - **Labels**: feature, bug, documentation, etc.
5. Click "Create pull request"
6. Wait for review và approval
7. Merge sau khi approved

---

## 📁 PROJECT STRUCTURE

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   │   ├── auth/        ✅ Done
│   │   ├── owner/       ⏳ Your task (Người 2)
│   │   ├── buyer/       ⏳ Your task (Người 3)
│   │   ├── cva/         ⏳ Your task (Người 3)
│   │   └── admin/       ⏳ Your task (Người 4)
│   ├── services/        ✅ API services ready
│   ├── context/         ✅ Auth context ready
│   ├── types/           ✅ TypeScript types ready
│   ├── theme/           ✅ Material-UI theme
│   └── utils/           ⏳ To implement (Người 5)
```

---

## 🎨 CODING EXAMPLES

### Example 1: Fetch Data và Display

```typescript
// src/pages/owner/OwnerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { reportService } from '@/services/report.service';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/cards/StatsCard';
import { DirectionsCar, Nature } from '@mui/icons-material';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await reportService.getPersonalStats(user.id);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Welcome, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Trips"
            value={stats?.totalTrips || 0}
            icon={<DirectionsCar />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Carbon Saved"
            value={`${stats?.totalCarbonSaved || 0} kg`}
            icon={<Nature />}
            color="#4caf50"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
```

### Example 2: Form với Validation

```typescript
// src/pages/owner/components/TripForm.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { tripService } from '@/services/trip.service';

interface TripFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    distance: '',
    energyConsumed: '',
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.distance || parseFloat(formData.distance) <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    }
    
    if (!formData.energyConsumed || parseFloat(formData.energyConsumed) <= 0) {
      newErrors.energyConsumed = 'Energy must be greater than 0';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setSubmitting(true);
      await tripService.createTrip({
        distance: parseFloat(formData.distance),
        energyConsumed: parseFloat(formData.energyConsumed),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record New Trip</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Distance (km)"
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              error={!!errors.distance}
              helperText={errors.distance}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Energy Consumed (kWh)"
              type="number"
              value={formData.energyConsumed}
              onChange={(e) => setFormData({ ...formData, energyConsumed: e.target.value })}
              error={!!errors.energyConsumed}
              helperText={errors.energyConsumed}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              error={!!errors.startTime}
              helperText={errors.startTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              error={!!errors.endTime}
              helperText={errors.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### Example 3: DataGrid với Actions

```typescript
// src/pages/owner/TripsPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { tripService } from '@/services/trip.service';
import { format } from 'date-fns';
import { TripForm } from './components/TripForm';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'startTime',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => format(new Date(params.row.startTime), 'MMM dd, yyyy'),
    },
    {
      field: 'distance',
      headerName: 'Distance (km)',
      width: 130,
      type: 'number',
    },
    {
      field: 'energyConsumed',
      headerName: 'Energy (kWh)',
      width: 130,
      type: 'number',
    },
    {
      field: 'carbonSaved',
      headerName: 'Carbon Saved (kg)',
      width: 150,
      type: 'number',
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: 'verificationStatus',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const status = params.value as string;
        const color =
          status === 'VERIFIED' ? 'success' :
          status === 'PENDING' ? 'warning' : 'error';
        return <Chip label={status} color={color} size="small" />;
      },
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            My Trips
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your electric vehicle trips
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Record New Trip
        </Button>
      </Box>

      <DataGrid
        rows={trips}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
      />

      <TripForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          fetchTrips();
          alert('Trip created successfully!');
        }}
      />
    </Box>
  );
};
```

---

## 🐛 DEBUGGING TIPS

### Check API Connectivity

```bash
# Test API Gateway
curl http://localhost:8000/health

# Test User Service
curl http://localhost:8000/api/users/health

# Check Docker services
docker-compose ps

# View logs
docker-compose logs -f api-gateway
docker-compose logs -f user-service
```

### Common Issues

**1. Port already in use**
```bash
# Find process using port 3000
npx kill-port 3000

# Or on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**2. Module not found**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**3. Docker container not starting**
```bash
# Rebuild without cache
docker-compose build --no-cache user-service
docker-compose up -d user-service
```

**4. CORS errors**
- Check `VITE_API_BASE_URL` in `.env`
- Ensure API Gateway CORS settings allow `http://localhost:5173`

---

## 📚 HELPFUL RESOURCES

### Documentation
- [Material-UI](https://mui.com/material-ui/getting-started/)
- [React Query](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)

### Code References
- [Material-UI Templates](https://mui.com/material-ui/getting-started/templates/)
- [Minimal UI Free](https://free.minimals.cc/)
- [Devias Kit](https://material-kit-react.devias.io/)

### API Testing
- Postman Collection: `docs/postman/`
- Swagger UI: `http://localhost:8000/api-docs` (if available)

---

## ✅ DAILY CHECKLIST

### Morning (9:00 AM)
- [ ] Pull latest changes từ `feat/api-gateway`
- [ ] Check team updates trong group chat
- [ ] Review assigned tasks
- [ ] Plan work for the day

### Before Coding
- [ ] Create feature branch
- [ ] Understand requirements
- [ ] Check existing code structure
- [ ] Plan implementation approach

### During Development
- [ ] Follow coding standards
- [ ] Write clean, readable code
- [ ] Add comments cho complex logic
- [ ] Test your code frequently

### Before Commit
- [ ] Remove console.logs
- [ ] Fix ESLint errors
- [ ] Test all functionality
- [ ] Write meaningful commit message

### End of Day (6:00 PM)
- [ ] Push your code
- [ ] Update progress trong group
- [ ] Note any blockers
- [ ] Plan next day's work

---

## 🆘 NEED HELP?

### Team Lead Contact
- **Name:** Thai (tranminhthai7)
- **GitHub:** @tranminhthai7
- **Zalo:** [Available in team group]

### Questions to Ask
1. **Unclear Requirements:** "What should this feature do exactly?"
2. **Technical Blocker:** "I'm stuck on X, can you help?"
3. **Design Decision:** "Should I use approach A or B for this?"
4. **API Issue:** "This API is not working as expected"

### Before Asking
1. Try to debug yourself (30 minutes)
2. Search Google/Stack Overflow
3. Check existing code for similar patterns
4. Prepare clear description of the problem

---

## 🎯 SUCCESS TIPS

1. **Start Small:** Implement one feature at a time
2. **Test Often:** Don't wait until everything is done
3. **Ask Early:** Don't struggle alone for hours
4. **Read Code:** Learn from existing implementations
5. **Stay Organized:** Keep your code clean and structured
6. **Communicate:** Update team on progress và blockers
7. **Take Breaks:** Fresh mind = better code
8. **Learn:** This is a learning opportunity!

---

**Good luck! You got this! 💪🚀**

---

**Last Updated:** 10/11/2025  
**Version:** 1.0
