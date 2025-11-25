import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Avatar, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  kycVerified?: boolean;
  createdAt: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        if (data.success) {
          // Transform API data to match component expectations
          const transformedUsers = data.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            kycVerified: user.kycVerified,
            createdAt: user.createdAt
          }));
          setUsers(transformedUsers);
        } else {
          throw new Error('API returned error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      field: 'kycVerified',
      headerName: 'KYC Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip 
          label={params.value ? 'Verified' : 'Pending'} 
          size="small" 
          color={params.value ? 'success' : 'warning'} 
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 150,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Users Management
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
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
        </CardContent>
      </Card>
    </Box>
  );
};
