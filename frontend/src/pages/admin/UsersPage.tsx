import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Avatar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const UsersPage: React.FC = () => {
  // Mock data - replace with actual API
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'EV_OWNER',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'BUYER',
      createdAt: '2024-02-20',
    },
  ];

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
  ];

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
