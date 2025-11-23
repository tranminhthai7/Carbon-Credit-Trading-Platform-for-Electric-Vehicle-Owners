export const getDashboardPathForRole = (role: string): string => {
  switch (role) {
    case 'ev_owner':
      return '/owner/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    case 'cva':
      return '/cva/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/login';
  }
};

export default getDashboardPathForRole;
