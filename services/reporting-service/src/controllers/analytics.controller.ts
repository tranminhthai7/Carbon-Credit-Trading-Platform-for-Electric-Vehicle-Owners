import { Request, Response } from "express";
import { userDbPool, carbonDbPool, marketplaceDbPool, paymentDbPool } from "../config/database";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

// GET /analytics/revenue
export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRange;

    // Generate date range for the last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query revenue data from carbon transactions (assuming TRANSFER transactions represent sales)
    const revenueQuery = `
      SELECT
        DATE(created_at) as date,
        SUM(amount * 5) as amount  -- Assuming 5 VND per credit
      FROM transaction
      WHERE type = 'TRANSFER'
        AND created_at >= $1
        AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const revenueResult = await carbonDbPool.query(revenueQuery, [start, end]);

    // Calculate total revenue
    const total = revenueResult.rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);

    const response = {
      currency: 'VND',
      total: Math.round(total),
      points: revenueResult.rows.map(row => ({
        date: row.date,
        amount: Math.round(parseFloat(row.amount || 0))
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    // Return empty data structure on error
    res.json({
      currency: 'VND',
      total: 0,
      points: []
    });
  }
};

// GET /analytics/users
export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRange;

    // Generate date range for the last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query user registration data
    const userQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= $1
        AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const userResult = await userDbPool.query(userQuery, [start, end]);

    // Generate points for each date in range
    const points = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = userResult.rows.find(row => row.date === dateStr);

      points.push({
        date: dateStr,
        activeUsers: Math.floor(Math.random() * 50) + 10, // Mock active users
        newUsers: parseInt(dayData?.new_users || 0),
        sessions: Math.floor(Math.random() * 200) + 50 // Mock sessions
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate totals
    const totals = {
      activeUsers: points.reduce((sum, p) => sum + p.activeUsers, 0),
      newUsers: points.reduce((sum, p) => sum + p.newUsers, 0),
      sessions: points.reduce((sum, p) => sum + p.sessions, 0)
    };

    res.json({
      points,
      totals
    });
  } catch (error) {
    console.error('Error getting user analytics:', error);
    // Return empty data structure on error
    res.json({
      points: [],
      totals: {
        activeUsers: 0,
        newUsers: 0,
        sessions: 0
      }
    });
  }
};

// GET /analytics/carbon
export const getCarbonAnalytics = async (req: Request, res: Response) => {
  try {
    // Query carbon credit statistics
    const carbonQuery = `
      SELECT
        SUM(CASE WHEN type = 'MINT' THEN amount ELSE 0 END) as minted,
        SUM(CASE WHEN type = 'TRANSFER' THEN amount ELSE 0 END) as sold,
        SUM(CASE WHEN type = 'BURN' THEN amount ELSE 0 END) as expired,
        COUNT(*) as total_transactions
      FROM transaction
    `;

    const carbonResult = await carbonDbPool.query(carbonQuery);
    const stats = carbonResult.rows[0];

    res.json({
      totalCredits: parseFloat(stats.minted || 0) - parseFloat(stats.sold || 0) - parseFloat(stats.expired || 0),
      minted: parseFloat(stats.minted || 0),
      sold: parseFloat(stats.sold || 0),
      expired: parseFloat(stats.expired || 0)
    });
  } catch (error) {
    console.error('Error getting carbon analytics:', error);
    // Return empty data structure on error
    res.json({
      totalCredits: 0,
      minted: 0,
      sold: 0,
      expired: 0
    });
  }
};