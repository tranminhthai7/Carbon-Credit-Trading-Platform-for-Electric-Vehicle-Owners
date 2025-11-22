import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import SafeAvatar from '../components/common/SafeAvatar';
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsCar,
  AccountBalanceWallet,
  Storefront,
  VerifiedUser,
  Assessment,
  People,
  Settings,
  Logout,
  Receipt,
  CardGiftcard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import getDashboardPathForRole from '../utils/navigation';
import { UserRole } from '../types';
import { safeInitial, safeReplace } from '../utils/stringHelpers';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // EV Owner routes
  {
    title: 'My Trips',
    path: '/owner/trips',
    icon: <DirectionsCar />,
    roles: [UserRole.EV_OWNER],
  },
  {
    title: 'Wallet',
    path: '/owner/wallet',
    icon: <AccountBalanceWallet />,
    roles: [UserRole.EV_OWNER],
  },
  {
    title: 'My Listings',
    path: '/owner/listings',
    icon: <Storefront />,
    roles: [UserRole.EV_OWNER],
  },
  // Buyer routes
  {
    title: 'Marketplace',
    path: '/buyer/marketplace',
    icon: <Storefront />,
    roles: [UserRole.BUYER],
  },
  {
    title: 'My Orders',
    path: '/buyer/orders',
    icon: <Receipt />,
    roles: [UserRole.BUYER],
  },
  {
    title: 'Certificates',
    path: '/buyer/certificates',
    icon: <CardGiftcard />,
    roles: [UserRole.BUYER],
  },
  // CVA routes
  {
    title: 'Verifications',
    path: '/cva/verifications',
    icon: <VerifiedUser />,
    roles: [UserRole.VERIFIER],
  },
  {
    title: 'Reports',
    path: '/cva/reports',
    icon: <Assessment />,
    roles: [UserRole.VERIFIER],
  },
  // Admin routes
  {
    title: 'Users',
    path: '/admin/users',
    icon: <People />,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Transactions',
    path: '/admin/transactions',
    icon: <Receipt />,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Analytics',
    path: '/admin/analytics',
    icon: <Assessment />,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: <Settings />,
    roles: [UserRole.ADMIN],
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Compute dynamic dashboard path for user's role
  const dashboardPath = user ? getDashboardPathForRole(user.role) : '/login';

  // Filter nav items based on user role
  const filteredNavItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary" fontWeight="bold">
          EV Carbon Platform
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {/* Dashboard link (dynamic) */}
        {user && (
          <ListItem key="dashboard" disablePadding>
            <ListItemButton onClick={() => navigate(dashboardPath)}>
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {filteredNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {safeReplace(user?.role, '_', ' ')} Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">{user?.full_name || user?.name}</Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <SafeAvatar name={user?.full_name || user?.name} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <Settings sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
