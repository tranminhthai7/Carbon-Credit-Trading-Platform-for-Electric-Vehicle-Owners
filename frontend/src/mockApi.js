// frontend/src/mockApi.js
export const mockAdminStats = {
  totalRevenue: 152400,
  totalUsers: 1247,
  totalTransactions: 892,
  activeListings: 156,
  revenueData: [
    { date: '01/06', revenue: 12000 },
    { date: '02/06', revenue: 19000 },
    { date: '03/06', revenue: 15000 },
    { date: '04/06', revenue: 22000 },
    { date: '05/06', revenue: 18000 },
    { date: '06/06', revenue: 25000 },
    { date: '07/06', revenue: 21000 },
  ],
  userGrowthData: [
    { date: '01/06', count: 1000 },
    { date: '02/06', count: 1050 },
    { date: '03/06', count: 1100 },
    { date: '04/06', count: 1150 },
    { date: '05/06', count: 1200 },
    { date: '06/06', count: 1220 },
    { date: '07/06', count: 1247 },
  ]
};

export const mockSystemHealth = {
  status: 'healthy',
  responseTime: 245,
  uptime: 99.8,
  activeUsers: 87
};

export const mockActivities = [
  {
    id: '1',
    type: 'user',
    title: 'Người dùng mới đăng ký',
    description: 'Nguyễn Văn A đã đăng ký tài khoản EV Owner',
    timestamp: new Date().toISOString(),
    user: 'Nguyễn Văn A'
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Giao dịch mới',
    description: 'Tín chỉ carbon #CC-001 đã được bán với giá 1,200,000 VND',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];