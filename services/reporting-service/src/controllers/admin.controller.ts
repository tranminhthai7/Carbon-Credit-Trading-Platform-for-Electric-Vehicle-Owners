import { Request, Response } from "express";
import { userDbPool, carbonDbPool, marketplaceDbPool, paymentDbPool } from "../config/database";

// Admin Stats - Tổng quan hệ thống
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // Query real data from databases
    const [userResult, transactionResult, listingResult] = await Promise.all([
      // Count total users
      userDbPool.query('SELECT COUNT(*) as count FROM users'),
      // Count total transactions and calculate revenue
      carbonDbPool.query(`
        SELECT
          COUNT(*) as transaction_count,
          COALESCE(SUM(CASE WHEN type = 'TRANSFER' THEN amount * 5 ELSE 0 END), 0) as revenue
        FROM transaction
      `),
      // Count active listings
      marketplaceDbPool.query('SELECT COUNT(*) as count FROM listing WHERE status = $1', ['OPEN'])
    ]);

    const totalUsers = parseInt(userResult.rows[0].count) || 0;
    const totalTransactions = parseInt(transactionResult.rows[0].transaction_count) || 0;
    const totalRevenue = parseFloat(transactionResult.rows[0].revenue) || 0;
    const activeListings = parseInt(listingResult.rows[0].count) || 0;

    const stats = {
      totalRevenue: Math.round(totalRevenue), // Round to VND
      totalUsers,
      totalTransactions,
      activeListings,
      revenueData: [
        { date: '01/11', revenue: 12000 },
        { date: '02/11', revenue: 19000 },
        { date: '03/11', revenue: 15000 },
        { date: '04/11', revenue: 22000 },
        { date: '05/11', revenue: 18000 },
        { date: '06/11', revenue: 25000 },
        { date: '07/11', revenue: 21000 },
      ],
      userGrowthData: [
        { date: '01/11', count: Math.max(1, totalUsers - 3) },
        { date: '02/11', count: Math.max(1, totalUsers - 2) },
        { date: '03/11', count: Math.max(1, totalUsers - 1) },
        { date: '04/11', count: totalUsers },
        { date: '05/11', count: totalUsers },
        { date: '06/11', count: totalUsers },
        { date: '07/11', count: totalUsers },
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    // Fallback to mock data if database queries fail
    const stats = {
      totalRevenue: 152400,
      totalUsers: 14,
      totalTransactions: 16,
      activeListings: 22,
      revenueData: [
        { date: '01/11', revenue: 12000 },
        { date: '02/11', revenue: 19000 },
        { date: '03/11', revenue: 15000 },
        { date: '04/11', revenue: 22000 },
        { date: '05/11', revenue: 18000 },
        { date: '06/11', revenue: 25000 },
        { date: '07/11', revenue: 21000 },
      ],
      userGrowthData: [
        { date: '01/11', count: 10 },
        { date: '02/11', count: 11 },
        { date: '03/11', count: 12 },
        { date: '04/11', count: 13 },
        { date: '05/11', count: 14 },
        { date: '06/11', count: 14 },
        { date: '07/11', count: 14 },
      ]
    };
    res.json(stats);
  }
};

// Admin Health - Tình trạng hệ thống
export const getAdminHealth = async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      responseTime: 245, // ms
      uptime: 99.8, // %
      activeUsers: 5 // mock
    };

    res.json(health);
  } catch (error) {
    console.error('Error getting admin health:', error);
    res.status(500).json({ error: 'Failed to get admin health' });
  }
};

// Admin Activities - Hoạt động gần đây
export const getAdminActivities = async (req: Request, res: Response) => {
  try {
    const activities = [
      {
        id: '1',
        type: 'user',
        title: 'Người dùng mới đăng ký',
        description: 'seed-seller@example.com đã đăng ký tài khoản EV Owner',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        user: 'seed-seller@example.com'
      },
      {
        id: '2',
        type: 'transaction',
        title: 'Giao dịch mới',
        description: 'Tín chỉ carbon #CC-001 đã được bán với giá 5 VND',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: '3',
        type: 'system',
        title: 'Hệ thống backup',
        description: 'Hệ thống backup dữ liệu thành công',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: '4',
        type: 'user',
        title: 'Người dùng mới đăng ký',
        description: 'seed-buyer@example.com đã đăng ký tài khoản Buyer',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        user: 'seed-buyer@example.com'
      },
      {
        id: '5',
        type: 'transaction',
        title: 'Listing mới',
        description: '10 tín chỉ carbon được niêm yết trên marketplace',
        timestamp: new Date(Date.now() - 1500000).toISOString()
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error getting admin activities:', error);
    res.status(500).json({ error: 'Failed to get admin activities' });
  }
};

// Admin Users - Danh sách người dùng
export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    // Query users from user database
    const result = await userDbPool.query(`
      SELECT
        id,
        email,
        email as name,
        role,
        is_verified as "kycVerified",
        created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `);

    const users = result.rows.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycVerified: user.kycVerified || false,
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error getting admin users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admin users'
    });
  }
};

// Admin Transactions - Danh sách giao dịch
export const getAdminTransactions = async (req: Request, res: Response) => {
  try {
    // Query all transaction types and combine them
    const transactionPromises = [];

    // Carbon credit transactions (MINT = EARN, TRANSFER/BURN = SPEND)
    transactionPromises.push(
      carbonDbPool.query(`
        SELECT
          t.id,
          CASE
            WHEN t."fromWalletId" IS NOT NULL THEN w1."userId"
            ELSE w2."userId"
          END as "userId",
          CASE
            WHEN t.type = 'MINT' THEN 'EARN'
            ELSE 'SPEND'
          END as type,
          t.amount,
          CASE
            WHEN t.type = 'MINT' THEN 'Carbon credit earned from trip'
            WHEN t.type = 'TRANSFER' THEN 'Carbon credit transferred'
            WHEN t.type = 'BURN' THEN 'Carbon credit burned'
            ELSE 'Carbon credit transaction'
          END as description,
          t.created_at as "createdAt"
        FROM transaction t
        LEFT JOIN wallet w1 ON t."fromWalletId" = w1.id
        LEFT JOIN wallet w2 ON t."toWalletId" = w2.id
        ORDER BY t.created_at DESC
      `).catch(() => ({ rows: [] }))
    );

    // Marketplace orders (SPEND) - only if table exists
    transactionPromises.push(
      marketplaceDbPool.query(`
        SELECT
          o.id,
          o."buyerId" as "userId",
          'SPEND' as type,
          o.amount,
          'Carbon credit purchase' as description,
          o."createdAt" as "createdAt"
        FROM "order" o
        ORDER BY o."createdAt" DESC
      `).catch(() => ({ rows: [] }))
    );

    // Payment transactions (SPEND) - only if table exists
    transactionPromises.push(
      paymentDbPool.query(`
        SELECT
          p.id,
          p.buyer_id as "userId",
          'SPEND' as type,
          p.amount,
          CASE
            WHEN p.payment_type = 'purchase' THEN 'Payment for carbon credits'
            WHEN p.payment_type = 'withdrawal' THEN 'Withdrawal'
            WHEN p.payment_type = 'refund' THEN 'Refund'
            ELSE 'Payment transaction'
          END as description,
          p.created_at as "createdAt"
        FROM payments p
        ORDER BY p.created_at DESC
      `).catch(() => ({ rows: [] }))
    );

    const [carbonTransactions, marketplaceOrders, payments] = await Promise.all(transactionPromises);

    // Combine all transactions
    const allTransactions = [
      ...carbonTransactions.rows.map((t: any) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: parseFloat(t.amount),
        description: t.description,
        createdAt: t.createdAt
      })),
      ...marketplaceOrders.rows.map((t: any) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: parseFloat(t.amount),
        description: t.description,
        createdAt: t.createdAt
      })),
      ...payments.rows.map((t: any) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: parseFloat(t.amount),
        description: t.description,
        createdAt: t.createdAt
      }))
    ];

    // Sort by createdAt descending and limit to recent transactions
    const sortedTransactions = allTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50); // Limit to 50 most recent transactions

    res.json({
      success: true,
      data: sortedTransactions
    });
  } catch (error) {
    console.error('Error getting admin transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admin transactions'
    });
  }
}