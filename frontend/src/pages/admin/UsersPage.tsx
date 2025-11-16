import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Avatar, Button, CircularProgress, Snackbar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import adminService from '../../services/admin.service';
import { User } from '../../types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32 }}>{params.value.charAt(0)}</Avatar>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params: any) => (
        <Chip label={params.value.replace('_', ' ')} size="small" />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      renderCell: (params: any) => {
        const user: User = params.row;
        return (
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={() => handleToggleBan(user)}>
              {user && (user as any).isBanned ? 'Unban' : 'Ban'}
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleBan(user: User) {
    try {
      const isBanned = (user as any).isBanned;
      if (isBanned) {
        await adminService.unbanUser(user.id);
        setSnack('User unbanned');
      } else {
        await adminService.banUser(user.id);
        setSnack('User banned');
      }
      fetchUsers();
    } catch (err: any) {
      setSnack(err?.response?.data?.message || 'Action failed');
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Users Management
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage platform users and roles
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>
          ) : error ? (
            <Box textAlign="center"><Typography color="error">{error}</Typography></Box>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
              disableRowSelectionOnClick
              checkboxSelection
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          )}
        </CardContent>
      </Card>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </Box>
  );
};
