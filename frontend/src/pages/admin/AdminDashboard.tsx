// frontend/src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Alert,
  Button,
  List,
  Tag,
  Space,
  Divider
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarOutlined,
  UserAddOutlined,
  TransactionOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  SyncOutlined,
  RocketOutlined
} from '@ant-design/icons';
import axios from 'axios';

// Types định nghĩa
interface PlatformStats {
  totalRevenue: number;
  totalUsers: number;
  totalTransactions: number;
  activeListings: number;
  revenueData: { date: string; revenue: number }[];
  userGrowthData: { date: string; count: number }[];
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  uptime: number;
  activeUsers: number;
}

interface Activity {
  id: string;
  type: 'user' | 'transaction' | 'system' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface AlertItem {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Giả lập API calls - thay thế bằng API thật khi backend ready
        const [statsResponse, healthResponse, activitiesResponse] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/health'),
          axios.get('/api/admin/activities')
        ]);

        setStats(statsResponse.data);
        setHealth(healthResponse.data);
        setActivities(activitiesResponse.data);
        
        // Giả lập alerts
        setAlerts([
          {
            id: '1',
            level: 'warning',
            message: 'Hệ thống thanh toán đang chậm',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            level: 'info',
            message: '5 tín chỉ mới được niêm yết',
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
        // Fallback data để demo
        setFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time updates mỗi 30 giây
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const setFallbackData = () => {
    // Dữ liệu mẫu để demo
    setStats({
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
    });

    setHealth({
      status: 'healthy',
      responseTime: 245,
      uptime: 99.8,
      activeUsers: 87
    });

    setActivities([
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
      },
      {
        id: '3',
        type: 'system',
        title: 'Hệ thống backup',
        description: 'Hệ thống backup dữ liệu thành công',
        timestamp: new Date(Date.now() - 600000).toISOString()
      }
    ]);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'orange';
      case 'critical': return 'red';
      default: return 'blue';
    }
  };

  const getAlertType = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  // Quick actions
  const quickActions = [
    {
      title: 'Quản lý người dùng',
      icon: <UserAddOutlined />,
      onClick: () => console.log('Navigate to user management')
    },
    {
      title: 'Xử lý giao dịch',
      icon: <TransactionOutlined />,
      onClick: () => console.log('Navigate to transaction management')
    },
    {
      title: 'Kiểm tra hệ thống',
      icon: <SafetyCertificateOutlined />,
      onClick: () => console.log('Run system check')
    },
    {
      title: 'Tạo báo cáo',
      icon: <RocketOutlined />,
      onClick: () => console.log('Generate report')
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <SyncOutlined spin style={{ fontSize: 48 }} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Bảng điều khiển Quản trị</h1>
      
      {/* Statistics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats?.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats?.totalUsers}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giao dịch"
              value={stats?.totalTransactions}
              valueStyle={{ color: '#cf1322' }}
              prefix={<TransactionOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tín chỉ đang niêm yết"
              value={stats?.activeListings}
              valueStyle={{ color: '#722ed1' }}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Doanh thu nền tảng theo thời gian" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Xu hướng đăng ký người dùng" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* System Health & Quick Actions */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Tình trạng hệ thống" bordered={false}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <strong>Trạng thái: </strong>
                <Tag color={getHealthStatusColor(health?.status || 'healthy')}>
                  {health?.status === 'healthy' ? 'Hoạt động tốt' : 
                   health?.status === 'warning' ? 'Cảnh báo' : 'Sự cố'}
                </Tag>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Thời gian phản hồi" value={health?.responseTime} suffix="ms" />
                </Col>
                <Col span={12}>
                  <Statistic title="Uptime" value={health?.uptime} suffix="%" />
                </Col>
              </Row>
              <Statistic title="Người dùng đang hoạt động" value={health?.activeUsers} />
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Hành động nhanh" bordered={false}>
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={index}>
                  <Button 
                    type="primary" 
                    icon={action.icon}
                    onClick={action.onClick}
                    style={{ width: '100%', height: '60px' }}
                  >
                    {action.title}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Alerts & Activities */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Cảnh báo quan trọng" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {alerts.map(alert => (
                <Alert
                  key={alert.id}
                  message={alert.message}
                  type={getAlertType(alert.level) as any}
                  showIcon
                  icon={<WarningOutlined />}
                  description={`Thời gian: ${new Date(alert.timestamp).toLocaleString()}`}
                />
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Hoạt động gần đây" bordered={false}>
            <Timeline>
              {activities.map(activity => (
                <Timeline.Item key={activity.id} color={
                  activity.type === 'user' ? 'blue' :
                  activity.type === 'transaction' ? 'green' :
                  activity.type === 'alert' ? 'red' : 'gray'
                }>
                  <strong>{activity.title}</strong>
                  <br />
                  {activity.description}
                  <br />
                  <small>{new Date(activity.timestamp).toLocaleString()}</small>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;